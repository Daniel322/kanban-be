import { User } from '../users/users.entity';

export interface ReqUser {
  id: string;
}
export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody extends Omit<LoginBody, 'password'> {
  password?: string;
  firstName: string;
  lastName: string;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
export interface RefreshBody {
  token: string;
}

export interface AuthorisedUser {
  tokens: Tokens;
  user: User;
}
