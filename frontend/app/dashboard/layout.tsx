import { DashboardGate } from "@/features/tasks/components/dashboard-gate";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <Suspense>
      <DashboardGate>{children}</DashboardGate>
    </Suspense>
  );
}
