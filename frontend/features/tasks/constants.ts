import { TASK_STATUSES, type TaskFilter, type TaskStatus } from "./types";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const STATUS_DOT_CLASS: Record<TaskStatus, string> = {
  todo: "bg-muted-foreground/50",
  in_progress: "bg-blue-500",
  done: "bg-emerald-500",
};

export const STATUS_OPTIONS = TASK_STATUSES.map((value) => ({
  value,
  label: STATUS_LABEL[value],
}));

export const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...STATUS_OPTIONS,
];
