"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "../types";
import { STATUS_DOT_CLASS } from "../constants";
import { StatusSelect } from "./status-select";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC", // keeps server and client output identical (no hydration mismatch)
});

type TaskCardProps = {
  task: Task;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start gap-2 text-base leading-snug">
          <span
            aria-hidden
            className={cn(
              "mt-1.5 size-2 shrink-0 rounded-full",
              STATUS_DOT_CLASS[task.status],
            )}
          />
          <span
            className={cn(
              task.status === "done" && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        {task.description ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {task.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/60">No description</p>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <StatusSelect
          value={task.status}
          onValueChange={(status) => onStatusChange(task, status)}
          className="h-8 w-36"
        />
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs text-muted-foreground">
            {dateFormatter.format(new Date(task.createdAt))}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${task.title}`}
            onClick={() => onEdit(task)}
          >
            <PencilIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${task.title}`}
            onClick={() => onDelete(task)}
          >
            <Trash2Icon />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
