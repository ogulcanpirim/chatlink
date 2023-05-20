import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  AcceptFriendRequest,
  DeleteProfilePictureRequest,
  GetChatMessagesRequest,
  GetChatRequest,
  LoginRequest,
  RegisterRequest,
  RejectFriendRequest,
  SendFriendRequest,
  UploadProfilePictureRequest,
} from "../actions/userActions";
import { toast } from "react-toastify";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  friends: string[];
  avatar: string | null;
  tag: string;
  createdAt: string;
  pendingRequests: IUser[];
}
export interface IMessageAPI {
  user_id: string;
  chat_id: string;
  content: string;
}

export interface IChatListItem {
  _id: string;
  users: IUser[];
  latestMessage: IMessage;
}

export interface IMessage {
  _id: string;
  chat_id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user_id: string;
}

export interface AvatarForm {
  avatar: File;
  id: string;
}

interface UserState {
  user: IUser | null;
  loading: boolean;
  error: boolean;
  errorMessage: string | null;
  chatList: IChatListItem[];
  chatMessages: IMessage[];
  selectedChat: IChatListItem | null;
  sending: boolean;
  chatsLoading: boolean;
  messageLoading: boolean;
  chatSearch: string;
  messageSearch: string;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: false,
  errorMessage: null,
  chatList: [],
  chatMessages: [],
  selectedChat: null,
  sending: false,
  chatsLoading: false,
  messageLoading: false,
  chatSearch: "",
  messageSearch: "",
};

const userSlicer = createSlice({
  name: "page",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    deleteUser(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
    setSelectedChat: (state, action: PayloadAction<IChatListItem | null>) => {
      state.selectedChat = action.payload;
    },
    setChatSearch: (state, action: PayloadAction<string>) => {
      state.chatSearch = action.payload;
    },
    setMessageSearch: (state, action: PayloadAction<string>) => {
      state.messageSearch = action.payload;
    },
    appendChat: (state, action: PayloadAction<IChatListItem>) => {
      state.chatList = [action.payload, ...state.chatList];
    },
    appendMessage: (state, action: PayloadAction<IMessage>) => {
      if (state.selectedChat?._id === action.payload.chat_id) {
        state.chatMessages = [...state.chatMessages, action.payload];
      }
      state.chatList = state.chatList.map((chat) => {
        if (chat._id === action.payload.chat_id) {
          chat.latestMessage = action.payload;
        }
        return chat;
      });
    },
    addPendingRequest(state, action) {
      if (state.user) {
        state.user.pendingRequests = [
          ...state.user.pendingRequests,
          action.payload,
        ];
      }
    },
    clearErrors(state) {
      if (state.error) {
        state.error = false;
        state.errorMessage = null;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(LoginRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(LoginRequest.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(
        LoginRequest.fulfilled,
        (state, action: PayloadAction<{ data: IUser }>) => {
          state.user = action.payload.data;
          state.loading = false;
          userSlicer.caseReducers.clearErrors(state);
          localStorage.setItem("user", JSON.stringify(action.payload.data));
        }
      )
      .addCase(RegisterRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(RegisterRequest.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(
        RegisterRequest.fulfilled,
        (state, action: PayloadAction<{ data: IUser }>) => {
          state.user = action.payload.data;
          state.loading = false;
          userSlicer.caseReducers.clearErrors(state);
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      )
      .addCase(GetChatRequest.pending, (state) => {
        state.chatsLoading = true;
      })
      .addCase(
        GetChatRequest.fulfilled,
        (state, action: PayloadAction<{ data: IChatListItem[] }>) => {
          state.chatList = action.payload.data.map((c) => ({
            ...c,
            typing: false,
          }));
          state.chatsLoading = false;
        }
      )
      .addCase(GetChatRequest.rejected, (state) => {
        state.chatsLoading = false;
      })
      .addCase(GetChatMessagesRequest.pending, (state) => {
        state.messageLoading = true;
      })
      .addCase(
        GetChatMessagesRequest.fulfilled,
        (state, action: PayloadAction<{ data: IMessage[] }>) => {
          state.chatMessages = action.payload.data;
          state.messageLoading = false;
        }
      )
      .addCase(GetChatMessagesRequest.rejected, (state) => {
        state.messageLoading = false;
      })
      .addCase(SendFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(SendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        userSlicer.caseReducers.clearErrors(state);
        toast.success(action.payload.message);
      })
      .addCase(SendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload as string);
      })
      .addCase(AcceptFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(AcceptFriendRequest.fulfilled, (state, action) => {
        const { friend_id, chat, message } = action.payload.data;
        toast.success(message);
        state.chatList = [...state.chatList, chat];
        if (state.user) {
          state.user = {
            ...state.user,
            pendingRequests: state.user?.pendingRequests.filter(
              (user) => user._id !== friend_id
            ),
          };
        }
        state.loading = false;
      })
      .addCase(AcceptFriendRequest.rejected, (state, action) => {
        const message = action.payload as string;
        toast.error(message);
        state.loading = false;
      })
      .addCase(RejectFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(RejectFriendRequest.fulfilled, (state, action) => {
        const { friend_id, message } = action.payload.data;
        toast.error(message);
        if (state.user) {
          state.user = {
            ...state.user,
            pendingRequests: state.user.pendingRequests.filter(
              (user) => user._id !== friend_id
            ),
          };
        }
        state.loading = false;
      })
      .addCase(RejectFriendRequest.rejected, (state, action) => {
        const message = action.payload as string;
        toast.error(message);
        state.loading = false;
      })
      .addCase(UploadProfilePictureRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(UploadProfilePictureRequest.fulfilled, (state, action) => {
        if (state.user) {
          const { avatar, message } = action.payload.data;
          state.user = { ...state.user, avatar };
          localStorage.setItem("user", JSON.stringify(state.user));
          toast.success(message);
        }
        state.loading = false;
      })
      .addCase(UploadProfilePictureRequest.rejected, (state, action) => {
        const message = action.payload as string;
        toast.error(message);
        state.loading = false;
      })
      .addCase(DeleteProfilePictureRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteProfilePictureRequest.fulfilled, (state, action) => {
        const { message } = action.payload.data;
        toast.success(message);
        if (state.user) {
          state.user = { ...state.user, avatar: null };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
        state.loading = false;
      })
      .addCase(DeleteProfilePictureRequest.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const {
  setUser,
  deleteUser,
  setSelectedChat,
  setChatSearch,
  setMessageSearch,
  appendChat,
  appendMessage,
  addPendingRequest,
  clearErrors,
} = userSlicer.actions;
export default userSlicer.reducer;
