import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";
import { IUserTags, LoginForm, RegisterForm } from "../../screens/Auth/Types";

export const LoginRequest = createAsyncThunk(
  "auth/login",
  async (data: LoginForm, thunkAPI) => {
    try {
      const response = await authService.LoginService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);

export const RegisterRequest = createAsyncThunk(
  "auth/register",
  async (data: RegisterForm, thunkAPI) => {
    try {
      const response = await authService.RegisterService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);

export const SendFriendRequest = createAsyncThunk(
  "auth/sendFriendRequest",
  async (data: IUserTags, thunkAPI) => {
    try {
      const response = await authService.SendFriendRequestService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);

export const AcceptFriendRequest = createAsyncThunk(
  "auth/acceptFriendRequest",
  async (data: IUserTags, thunkAPI) => {
    try {
      const response = await authService.AcceptFriendRequestService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);

export const RejectFriendRequest = createAsyncThunk(
  "auth/rejectFriendRequest",
  async (data: IUserTags, thunkAPI) => {
    try {
      const response = await authService.RejectFriendRequestService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);
