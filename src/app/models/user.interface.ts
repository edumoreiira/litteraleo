export interface UserSignIn {
  email: string;
  password: string;
}

export interface UserSignUp {
  name: string;
  email: string;
  password: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  role: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  }
}