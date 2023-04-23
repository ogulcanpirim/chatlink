import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { LoginRequest, RegisterRequest } from "../actions/authActions";

interface IUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
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
      );
  },
});

export const { deleteUser } = authSlicer.actions;
export default authSlicer.reducer;
