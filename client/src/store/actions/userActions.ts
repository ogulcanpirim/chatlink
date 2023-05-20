import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../services/userService";
import { IUserTags, LoginForm, RegisterForm } from "../../screens/Auth/Types";
import { AvatarForm, IMessageAPI } from "../reducers/userReducer";

export const LoginRequest = createAsyncThunk(
  "auth/login",
  async (data: LoginForm, thunkAPI) => {
    try {
      const response = await userService.LoginService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const RegisterRequest = createAsyncThunk(
  "auth/register",
  async (data: RegisterForm, thunkAPI) => {
    try {
      const response = await userService.RegisterService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const SendFriendRequest = createAsyncThunk(
  "auth/sendFriendRequest",
  async (data: IUserTags, thunkAPI) => {
    try {
      const response = await userService.SendFriendRequestService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const AcceptFriendRequest = createAsyncThunk(
  "auth/acceptFriendRequest",
  async (data: IUserTags, thunkAPI) => {
    try {
      const response = await userService.AcceptFriendRequestService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const RejectFriendRequest = createAsyncThunk(
  "auth/rejectFriendRequest",
  async (data: IUserTags, thunkAPI) => {
    try {
      const response = await userService.RejectFriendRequestService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const UploadProfilePictureRequest = createAsyncThunk(
  "auth/uploadProfilePicture",
  async (data: AvatarForm, thunkAPI) => {
    try {
      const response = await userService.UploadProfilePictureService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const DeleteProfilePictureRequest = createAsyncThunk(
  "auth/deleteProfilePicture",
  async (id: string, thunkAPI) => {
    try {
      const response = await userService.DeleteProfilePictureService(id);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);

export const GetChatRequest = createAsyncThunk(
  "page/getChat",
  async (id: string, thunkAPI) => {
    try {
      const response = await userService.GetUserChatService(id);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);

export const GetChatMessagesRequest = createAsyncThunk(
  "page/getChatMessages",
  async (id: string, thunkAPI) => {
    try {
      const response = await userService.GetChatMessagesService(id);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);

export const SendChatMessageRequest = createAsyncThunk(
  "page/sendChatMessage",
  async (data: IMessageAPI, thunkAPI) => {
    try {
      const response = await userService.SendChatMessageService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);
