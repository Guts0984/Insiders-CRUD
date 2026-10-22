import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "@/lib/api";
import { AUTH_COOKIE } from "@/features/auth/session";
import type { Task } from "./types";

/** Authenticated fetch against `${API_URL}/api/tasks{path}`. Server only. */
export async function tasksFetch(
  path: string,
  init: Omit<RequestInit, "headers"> = {},
): Promise<Response> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  return fetch(`${API_URL}/api/tasks${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function getTasks(): Promise<Task[]> {
  const res = await tasksFetch("");

  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error("Failed to load tasks");

  const data = await res.json();
  // Supports both `[...]` and `{ tasks: [...] }` response shapes.
  return Array.isArray(data) ? data : (data.tasks ?? []);
}
