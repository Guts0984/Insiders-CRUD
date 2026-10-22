"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateTaskAction } from "../actions";
import { FILTERS, STATUS_LABEL } from "../constants";
import type { Task, TaskFilter, TaskStatus } from "../types";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { TaskCard } from "./tasks-card";
import { TaskFormDialog } from "./tasks-form-dialog";

export function TasksDashboard({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [formTask, setFormTask] = useState<Task | null | undefined>(undefined); // undefined = closed, null = create
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Status changes feel instant; the list reverts automatically if the request fails.
  const [optimisticTasks, setOptimisticStatus] = useOptimistic(
    tasks,
    (current, change: { id: string; status: TaskStatus }) =>
      current.map((t) =>
        t.id === change.id ? { ...t, status: change.status } : t,
      ),
  );

  const counts = useMemo(() => {
    const result: Record<TaskFilter, number> = {
      all: optimisticTasks.length,
      todo: 0,
      in_progress: 0,
      done: 0,
    };
    for (const task of optimisticTasks) result[task.status]++;
    return result;
  }, [optimisticTasks]);

  const visibleTasks =
    filter === "all"
      ? optimisticTasks
      : optimisticTasks.filter((t) => t.status === filter);

  function handleStatusChange(task: Task, status: TaskStatus) {
    if (task.status === status) return;
    setError(null);
    startTransition(async () => {
      setOptimisticStatus({ id: task.id, status });
      const result = await updateTaskAction(task.id, { status });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as TaskFilter)}
        >
          <TabsList>
            {FILTERS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
                <span className="ml-1.5 text-xs tabular-nums text-muted-foreground">
                  {counts[item.value]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Button onClick={() => setFormTask(null)}>
          <PlusIcon />
          New task
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {visibleTasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {filter === "all"
              ? "You have no tasks yet. Add your first one to get started."
              : `No tasks marked “${STATUS_LABEL[filter]}”.`}
          </p>
          {filter === "all" && (
            <Button variant="outline" onClick={() => setFormTask(null)}>
              <PlusIcon />
              New task
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTasks.map((task) => (
            <li key={task.id} className="flex">
              <div className="flex w-full flex-col">
                <TaskCard
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={setFormTask}
                  onDelete={setDeleteTarget}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {formTask !== undefined && (
        <TaskFormDialog
          key={formTask?.id ?? "new"}
          task={formTask}
          onClose={() => setFormTask(undefined)}
        />
      )}

      {deleteTarget && (
        <DeleteTaskDialog
          task={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
