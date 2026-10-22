import type { Request, Response } from "express";
import { z } from "zod";
import * as tasksService from "./tasks.service.ts";

const taskIdSchema = z.uuid();
const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);
const taskQuerySchema = z.object({
  status: taskStatusSchema.optional(),
});

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  status: taskStatusSchema.default("todo"),
});

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000).nullable(),
    status: taskStatusSchema,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export async function list(req: Request, res: Response): Promise<void> {
  const { status } = taskQuerySchema.parse(req.query);
  const tasks = await tasksService.listTasks(res.locals.userId as string, status);
  res.json(tasks);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = taskIdSchema.parse(req.params.id);
  const task = await tasksService.getTaskById(res.locals.userId as string, id);
  res.json(task);
}

export async function create(req: Request, res: Response): Promise<void> {
  const data = createTaskSchema.parse(req.body);
  const task = await tasksService.createTask(res.locals.userId as string, data);
  res.status(201).json(task);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = taskIdSchema.parse(req.params.id);
  const data = updateTaskSchema.parse(req.body);
  const task = await tasksService.updateTask(
    res.locals.userId as string,
    id,
    data,
  );
  res.json(task);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = taskIdSchema.parse(req.params.id);
  await tasksService.deleteTask(res.locals.userId as string, id);
  res.status(204).send();
}
