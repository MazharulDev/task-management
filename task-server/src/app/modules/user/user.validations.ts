import { z } from 'zod';

const createUser = z.object({
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
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'USER'], {
      required_error: 'Role is required',
    }).optional(),
  }),
});

const updateUser = z.object({
  body: z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    name: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'USER']).optional(),
  }),
});

export const UserValidation = {
  createUser,
  updateUser,
};
