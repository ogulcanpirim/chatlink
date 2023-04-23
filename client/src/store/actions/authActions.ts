import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";
import { LoginForm, RegisterForm } from "../../screens/Auth/Types";

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
