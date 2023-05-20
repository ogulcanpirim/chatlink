import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./userReducer";

interface PageState {
  darkMode: boolean;
  headerModal: boolean;
  chatModal: boolean;
  friendModal: boolean;
  friendTagModal: boolean;
  emojiModal: boolean;
  friendTag: string;
  userModal: IUser | null;
  messageSearchModal: boolean;
  deleteProfileModal: boolean;
}

const initialState: PageState = {
  darkMode: true,
  headerModal: false,
  chatModal: false,
  friendModal: false,
  friendTagModal: false,
  emojiModal: false,
  friendTag: "",
  userModal: null,
  messageSearchModal: false,
  deleteProfileModal: false,
};

export const pageSlicer = createSlice({
  name: "page",
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      localStorage.setItem("darkMode", JSON.stringify(action.payload));
      state.darkMode = action.payload;
    },
    setHeaderModal: (state, action: PayloadAction<boolean>) => {
      state.headerModal = action.payload;
    },
    setChatModal: (state, action: PayloadAction<boolean>) => {
      state.chatModal = action.payload;
    },
    setFriendModal: (state, action: PayloadAction<boolean>) => {
      state.friendModal = action.payload;
    },
    setFriendTagModal: (state, action: PayloadAction<boolean>) => {
      state.friendTagModal = action.payload;
    },
    setEmojiModal: (state, action: PayloadAction<boolean>) => {
      state.emojiModal = action.payload;
    },
    setFriendTag: (state, action: PayloadAction<string>) => {
      state.friendTag = action.payload;
    },
    setUserModal: (state, action: PayloadAction<IUser | null>) => {
      state.userModal = action.payload;
    },
    setMessageSearchModal: (state, action: PayloadAction<boolean>) => {
      state.messageSearchModal = action.payload;
    },
    setDeleteProfileModal: (state, action: PayloadAction<boolean>) => {
      state.deleteProfileModal = action.payload;
    },
    resetPage: () => initialState,
  },
});

export const {
  setDarkMode,
  setHeaderModal,
  setChatModal,
  resetPage,
  setFriendModal,
  setFriendTag,
  setFriendTagModal,
  setEmojiModal,
  setUserModal,
  setMessageSearchModal,
  setDeleteProfileModal,
} = pageSlicer.actions;
export default pageSlicer.reducer;
