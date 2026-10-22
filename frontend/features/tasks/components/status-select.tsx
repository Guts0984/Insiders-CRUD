"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "../types";
import { STATUS_OPTIONS } from "../constants";

type StatusSelectProps = {
  value: TaskStatus;
  onValueChange: (value: TaskStatus) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
};

export function StatusSelect({
  value,
  onValueChange,
  id,
  disabled,
  className,
}: StatusSelectProps) {
  return (
    <Select
      items={STATUS_OPTIONS}
      value={value}
      onValueChange={(next) => next && onValueChange(next as TaskStatus)}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
