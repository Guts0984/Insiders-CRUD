"use server";

import { revalidatePath } from "next/cache";
import { tasksFetch } from "./api";
import { taskSchema, type TaskValues } from "./schemas";

type TaskActionResult = { error: string } | undefined;

async function mutate(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<TaskActionResult> {
  let res: Response;
  try {
    res = await tasksFetch(path, {
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (res.status === 401) {
    return { error: "Your session has expired. Sign in again to continue." };
  }

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    return { error: data?.error ?? "Something went wrong. Please try again." };
  }

  revalidatePath("/dashboard");
}

export async function createTaskAction(
  values: TaskValues,
): Promise<TaskActionResult> {
  const parsed = taskSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid form data" };

  return mutate("", "POST", parsed.data);
}

export async function updateTaskAction(
  id: string,
  values: Partial<TaskValues>,
): Promise<TaskActionResult> {
  const parsed = taskSchema.partial().safeParse(values);
  if (!parsed.success) return { error: "Invalid form data" };

  return mutate(`/${encodeURIComponent(id)}`, "PATCH", parsed.data);
}

export async function deleteTaskAction(id: string): Promise<TaskActionResult> {
  return mutate(`/${encodeURIComponent(id)}`, "DELETE");
}
