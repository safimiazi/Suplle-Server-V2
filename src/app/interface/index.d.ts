import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      activeSubscription?: any; // Optional property for active subscription
    }
  }
}