import { z } from 'zod';

const createTaskZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    body: z.string({
      required_error: 'Body is required',
    }),
  }),
});

const updateTaskZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    body: z.string().optional(),
  }),
});

export const TaskValidation = {
  createTaskZodSchema,
  updateTaskZodSchema,
};
