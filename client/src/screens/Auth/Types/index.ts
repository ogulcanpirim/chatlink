export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  repassword: string;
}

export interface IUserTags {
  user_tag: string;
  friend_tag: string;
}
