// Added by Antigravity
import { z } from "zod";

export const createThoughtSchema = z.object({
  rawContent: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, { message: "Thought content cannot be empty." })
        .max(10000, { message: "Thought content is too long (max 10,000 characters)." })
    ),
});

export type CreateThoughtInput = z.infer<typeof createThoughtSchema>;

export const updateThoughtSchema = z.object({
  id: z.string().uuid({ message: "Invalid thought ID format." }),
  rawContent: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, { message: "Thought content cannot be empty." })
        .max(10000, { message: "Thought content is too long (max 10,000 characters)." })
    ),
});

export type UpdateThoughtInput = z.infer<typeof updateThoughtSchema>;

export const archiveThoughtSchema = z.object({
  id: z.string().uuid({ message: "Invalid thought ID format." }),
});

export const searchThoughtSchema = z.object({
  query: z.string().min(1, { message: "Search query cannot be empty." }).max(500),
});

export type SearchThoughtInput = z.infer<typeof searchThoughtSchema>;
