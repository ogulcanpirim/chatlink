import { createAsyncThunk } from "@reduxjs/toolkit";
import { pageService } from "../services/pageService";
import { IMessageAPI } from "../reducers/pageReducer";

export const GetChatRequest = createAsyncThunk(
  "page/getChat",
  async (id: string, thunkAPI) => {
    try {
      const response = await pageService.GetUserChatService(id);
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
      const response = await pageService.GetChatMessagesService(id);
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
      const response = await pageService.SendChatMessageService(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);
