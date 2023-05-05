import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  GetChatMessagesRequest,
  GetChatRequest,
  SendChatMessageRequest,
} from "../actions/pageActions";

export interface IMessageAPI {
  user_id: string;
  chat_id: string;
  content: string;
}

export interface IChatListItem {
  _id: string;
  users: [
    {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
    }
  ];
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

interface PageState {
  sending: boolean;
  chatsLoading: boolean;
  messageLoading: boolean;
  chatList: IChatListItem[];
  chatMessages: IMessage[];
  darkMode: boolean;
  headerModal: boolean;
  chatModal: boolean;
  selectedChat: IChatListItem | null;
  chatSearch: string;
  friendModal: boolean;
  friendTagModal: boolean;
  friendTag: string;
  userModal: boolean;
}

const initialState: PageState = {
  sending: false,
  chatsLoading: false,
  messageLoading: false,
  chatList: [],
  chatMessages: [],
  darkMode: true,
  headerModal: false,
  chatModal: false,
  selectedChat: null,
  chatSearch: "",
  friendModal: false,
  friendTagModal: false,
  friendTag: "",
  userModal: false,
};

const pageSlicer = createSlice({
  name: "page",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    changeDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    toggleHeaderModal: (state) => {
      state.headerModal = !state.headerModal;
    },
    toggleChatModal: (state) => {
      state.chatModal = !state.chatModal;
    },
    resetPage: (state) => {
      state.headerModal = initialState.headerModal;
      state.chatModal = initialState.chatModal;
      state.darkMode = initialState.darkMode;
      state.selectedChat = initialState.selectedChat;
    },
    setFriendModal: (state, action: PayloadAction<boolean>) => {
      state.friendModal = action.payload;
    },
    setFriendTagModal: (state, action: PayloadAction<boolean>) => {
      state.friendTagModal = action.payload;
    },
    setFriendTag: (state, action: PayloadAction<string>) => {
      state.friendTag = action.payload;
    },
    setUserModal: (state, action: PayloadAction<boolean>) => {
      state.userModal = action.payload;
    },
    setSelectedChat: (state, action: PayloadAction<IChatListItem>) => {
      state.selectedChat = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
    setChatSearch: (state, action: PayloadAction<string>) => {
      state.chatSearch = action.payload;
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
  },
  extraReducers(builder) {
    builder
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
      .addCase(SendChatMessageRequest.pending, (state) => {
        state.sending = true;
      })
      .addCase(SendChatMessageRequest.fulfilled, (state, action) => {
        const newMessage = action.payload.data;
        state.sending = false;
      })
      .addCase(SendChatMessageRequest.rejected, (state) => {
        state.sending = false;
      });
  },
});

export const {
  toggleDarkMode,
  toggleHeaderModal,
  toggleChatModal,
  resetPage,
  setFriendModal,
  setFriendTag,
  setFriendTagModal,
  setUserModal,
  setSelectedChat,
  clearSelectedChat,
  setChatSearch,
  appendMessage,
} = pageSlicer.actions;
export default pageSlicer.reducer;
