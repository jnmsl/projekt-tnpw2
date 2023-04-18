import express from 'express';
import { postsRouter } from './routes/posts';
import { usersRouter } from './routes/users';
import * as trpcExpress from '@trpc/server/adapters/express';
import { router, createContext } from './trpc';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();

const appRouter = router({
  post: postsRouter,
  user: usersRouter,
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use(express.static(path.join(__dirname, '../client/dist')));

export type AppRouter = typeof appRouter;

export default app;
