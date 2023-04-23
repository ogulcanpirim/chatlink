import { LoginForm, RegisterForm } from "../../screens/Auth/Types";
import { APIClient } from "../../utils/APIClient";

export const LoginService = async (data: LoginForm) => {
  const response = await APIClient.post("/auth/login", data);
  return response.data;
};

export const RegisterService = async (data: RegisterForm) => {
  const response = await APIClient.post("/auth/register", data);
  return response.data;
};

export const authService = {
  LoginService,
  RegisterService,
};
