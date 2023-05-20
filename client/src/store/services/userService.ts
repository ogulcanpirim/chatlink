import { IUserTags, LoginForm, RegisterForm } from "../../screens/Auth/Types";
import { APIClient } from "../../utils/APIClient";
import { AvatarForm, IMessageAPI } from "../reducers/userReducer";

export const LoginService = async (data: LoginForm) => {
  const response = await APIClient.post("/auth/login", data);
  return response.data;
};

export const RegisterService = async (data: RegisterForm) => {
  const response = await APIClient.post("/auth/register", data);
  return response.data;
};

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

export const SendFriendRequestService = async (data: IUserTags) => {
  const response = await APIClient.post("friend/request/send", data);
  return response.data;
};

export const AcceptFriendRequestService = async (data: IUserTags) => {
  const response = await APIClient.post("friend/request/accept", data);
  return response.data;
};

export const RejectFriendRequestService = async (data: IUserTags) => {
  const response = await APIClient.post("friend/request/reject", data);
  return response.data;
};

export const UploadProfilePictureService = async (data: AvatarForm) => {
  const formData = new FormData();
  formData.append("image", data.avatar);
  const response = await APIClient.patch(
    `user/${data.id}/update-avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const DeleteProfilePictureService = async (id: string) => {
  const response = await APIClient.delete(`user/${id}/delete-avatar`);
  return response.data;
};

export const userService = {
  LoginService,
  RegisterService,
  GetUserChatService,
  GetChatMessagesService,
  SendChatMessageService,
  SendFriendRequestService,
  AcceptFriendRequestService,
  RejectFriendRequestService,
  UploadProfilePictureService,
  DeleteProfilePictureService,
};
