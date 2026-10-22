import { z } from "zod";
import { TASK_STATUSES } from "./types";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a title")
    .max(120, "Keep the title under 120 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Keep the description under 1000 characters"),
  status: z.enum(TASK_STATUSES),
});

export type TaskValues = z.infer<typeof taskSchema>;
