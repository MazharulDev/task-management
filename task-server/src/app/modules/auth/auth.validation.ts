import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email({
      message: 'Invalid email format',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const registerZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email({
      message: 'Invalid email format',
    }),
    password: z.string({
      required_error: 'Password is required',
    }).min(6, {
      message: 'Password must be at least 6 characters',
    }),
    name: z.string({
      required_error: 'Name is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  registerZodSchema,
  refreshTokenZodSchema,
};
