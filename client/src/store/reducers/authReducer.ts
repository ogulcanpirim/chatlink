import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  AcceptFriendRequest,
  DeleteProfilePictureRequest,
  LoginRequest,
  RegisterRequest,
  RejectFriendRequest,
  SendFriendRequest,
  UploadProfilePictureRequest,
} from "../actions/authActions";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  tag: string;
  pendingRequests: IUser[];
}
export interface AvatarForm {
  avatar: File;
  id: string;
}

interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: boolean;
  errorMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: false,
  errorMessage: null,
};

const authSlicer = createSlice({
  name: "page",
  initialState,
  reducers: {
    setUser(state, action) {
      console.log("setUser", action.payload);
      state.user = action.payload;
    },
    deleteUser(state) {
      state.user = null;
      localStorage.removeItem("user");
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
        console.log("login request pending");
      })
      .addCase(LoginRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        console.log("login request failed");
      })
      .addCase(
        LoginRequest.fulfilled,
        (state, action: PayloadAction<{ data: IUser }>) => {
          state.user = action.payload.data;
          state.loading = false;
          authSlicer.caseReducers.clearErrors(state);
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      )
      .addCase(RegisterRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(RegisterRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(
        RegisterRequest.fulfilled,
        (state, action: PayloadAction<{ data: IUser }>) => {
          state.user = action.payload.data;
          state.loading = false;
          authSlicer.caseReducers.clearErrors(state);
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      )
      .addCase(SendFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(SendFriendRequest.fulfilled, (state, action) => {
        authSlicer.caseReducers.clearErrors(state);
        state.loading = false;
      })
      .addCase(SendFriendRequest.rejected, (state, action) => {
        state.errorMessage = action.payload as string;
        state.error = true;
        state.loading = false;
      })
      .addCase(AcceptFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(AcceptFriendRequest.fulfilled, (state, action) => {
        const friend_id = action.payload.data;
        state.user?.pendingRequests.filter((user) => user._id !== friend_id);
        state.loading = false;
      })
      .addCase(AcceptFriendRequest.rejected, (state) => {
        state.loading = false;
      })
      .addCase(RejectFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(RejectFriendRequest.fulfilled, (state, action) => {
        const friend_id = action.payload.data;
        state.user?.pendingRequests.filter((user) => user._id !== friend_id);
        state.loading = false;
      })
      .addCase(RejectFriendRequest.rejected, (state) => {
        state.loading = false;
      })
      .addCase(UploadProfilePictureRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(UploadProfilePictureRequest.fulfilled, (state, action) => {
        if (state.user) {
          const newAvatar = action.payload.data.avatar;
          state.user = { ...state.user, avatar: newAvatar };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
        state.loading = false;
      })
      .addCase(UploadProfilePictureRequest.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(DeleteProfilePictureRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteProfilePictureRequest.fulfilled, (state, action) => {
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

export const { setUser, deleteUser, clearErrors } = authSlicer.actions;
export default authSlicer.reducer;
