import { z } from "zod";

export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

//type inference in zod
// frontned will require this

export const signipInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

//type inference in zod
// frontned will require this

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  id: z.string(),
});

export type SignupInput = z.infer<typeof signupInput>;
export type SignipInput = z.infer<typeof signupInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
