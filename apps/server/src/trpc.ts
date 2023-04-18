import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import User from './models/user';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  interface User {
    _id: string;
    username: string;
    hashedPassword: string;
  }

  let user: User | null = null;

  const token = req.cookies.token;

  console.log('Parsed token:', token);

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = await User.findById((decoded as jwt.JwtPayload).id);
    } catch (error) {
      console.error(error);

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
