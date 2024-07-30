import { Response } from 'express';
import { AuthenticatedUser } from '../middlewares/interfaces/authTokenPayload.interface';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
