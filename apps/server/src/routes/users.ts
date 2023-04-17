import { publicProcedure, router } from '../trpc';
import User from '../models/user';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const registerInput = z.object({
  username: z.string(),
  password: z.string(),
});

const loginInput = z.object({
  username: z.string(),
  password: z.string(),
});

const register = publicProcedure
  .input(registerInput)
  .mutation(async ({ input: { username, password } }) => {
    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error('Username already exists.');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({ username, hashedPassword });
    await newUser.save();
    return 'User registered successfully.';
  });

const login = publicProcedure
  .input(loginInput)
  .mutation(async ({ input: { username, password }, ctx }) => {
    const user = await User.findOne({ username });
    if (!user) throw new Error('Invalid username or password.');

    // Replace user.password with user.hashedPassword
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) throw new Error('Invalid username or password.');

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    ctx.res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production',
    });

    return token;
  });

const logout = publicProcedure.mutation(async ({ ctx }) => {
  ctx.res.clearCookie('token');
  return 'Logged out successfully.';
});

const getCurrentUser = publicProcedure.query(async ({ ctx }) => {
  // if logged in return a user if not return null
  if (ctx.user) {
    return ctx.user;
  } else {
    return null;
  }
});

export const usersRouter = router({
  register,
  login,
  logout,
  getCurrentUser,
});
