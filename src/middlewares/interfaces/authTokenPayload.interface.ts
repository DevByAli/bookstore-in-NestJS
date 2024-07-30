import { JwtPayload } from 'jsonwebtoken';

export type AuthenticatedUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  cloudinaryId: string;
}

export interface AuthTokenPayload extends JwtPayload {
  user: AuthenticatedUser;
}
