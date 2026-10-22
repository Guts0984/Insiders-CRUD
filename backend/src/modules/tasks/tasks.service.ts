import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { tasks, type NewTask, type Task } from "../../db/schema.ts";
import { appError } from "../../utils/app-error.ts";

export type CreateTaskInput = Pick<
  NewTask,
  "title" | "description" | "status"
>;
export type UpdateTaskInput = Partial<CreateTaskInput>;

export async function listTasks(
  userId: string,
  status?: Task["status"],
): Promise<Task[]> {
  const condition = status
    ? and(eq(tasks.userId, userId), eq(tasks.status, status))
    : eq(tasks.userId, userId);

  return db.select().from(tasks).where(condition).orderBy(desc(tasks.createdAt));
}

export async function getTaskById(
  userId: string,
  id: string,
): Promise<Task> {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));

  if (!task) {
    throw appError(404, "Task not found");
  }

  return task;
}

export async function createTask(
  userId: string,
  data: CreateTaskInput,
): Promise<Task> {
  const [created] = await db
    .insert(tasks)
    .values({ ...data, userId })
    .returning();
  return created;
}

export async function updateTask(
  userId: string,
  id: string,
  data: UpdateTaskInput,
): Promise<Task> {
  const [updated] = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();

  if (!updated) {
    throw appError(404, "Task not found");
  }

  return updated;
}

export async function deleteTask(userId: string, id: string): Promise<void> {
  const [deleted] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning({ id: tasks.id });

  if (!deleted) {
    throw appError(404, "Task not found");
  }
}
