import { redirect } from "next/navigation";
import { getSessionUser } from "@/features/auth/session";
import { getTasks } from "@/features/tasks/api";
import { TasksDashboard } from "@/features/tasks/components/tasks-dashboard";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const tasks = await getTasks();

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Track what to do, what’s in progress, and what’s finished.
          </p>
        </div>
      </header>

      <TasksDashboard tasks={tasks} />
    </main>
  );
}
