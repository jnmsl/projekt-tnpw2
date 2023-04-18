import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import User from './models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface User {
  _id: string;
  username: string;
  hashedPassword: string;
}

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  let user: User | null = null;

  const token = req.cookies.token;

  console.log('Parsed token:', token);

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      if (decoded.id) {
        user = await User.findById(decoded.id);
      }
    } catch (error) {
      console.error('Error decoding token:', error);

      res.clearCookie('token');
      res.redirect('/login');
    }
  }

  return { req, res, user };
};

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
