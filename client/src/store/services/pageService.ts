import { APIClient } from "../../utils/APIClient";
import { IMessageAPI } from "../reducers/pageReducer";

export const GetUserChatService = async (id: string) => {
  const response = await APIClient.get(`/chat/${id}`);
  return response.data;
};

export const GetChatMessagesService = async (id: string) => {
  const response = await APIClient.get(`/message/${id}`);
  return response.data;
};

export const SendChatMessageService = async (data: IMessageAPI) => {
  const response = await APIClient.post(`/message/send/${data.chat_id}`, {
    ...data,
  });
  return response.data;
};

export const pageService = {
  GetUserChatService,
  GetChatMessagesService,
  SendChatMessageService,
};
