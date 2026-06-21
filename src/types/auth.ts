export const AUTH_USERS_KEY = "tidl-users-v1";
export const AUTH_SESSION_KEY = "tidl-session-v1";

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
}

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
