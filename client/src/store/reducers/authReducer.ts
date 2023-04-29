import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  AcceptFriendRequest,
  LoginRequest,
  RegisterRequest,
  RejectFriendRequest,
  SendFriendRequest,
} from "../actions/authActions";

interface IUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  tag: string;
  pendingRequests: IUser[];
}

interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: boolean;
}

const initialState: AuthState = { user: null, loading: false, error: false };

const authSlicer = createSlice({
  name: "page",
  initialState,
  reducers: {
    deleteUser(state) {
      state.user = null;
      localStorage.removeItem("user");
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
          state.error = false;
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
          state.error = false;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      )
      .addCase(SendFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(SendFriendRequest.fulfilled, (state, action) => {
        console.log(
          "send friend request fulfilled with action: ",
          action.payload
        );
        state.loading = false;
      })
      .addCase(SendFriendRequest.rejected, (state, action) => {
        console.log("send friend request rejected with action: ", action.payload);
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
      });
  },
});

export const { deleteUser } = authSlicer.actions;
export default authSlicer.reducer;
