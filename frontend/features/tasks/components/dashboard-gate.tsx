import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getSessionUser } from "@/features/auth/session";
import { redirect } from "next/navigation";

export async function DashboardGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/");

  return (
    <>
      <header className="flex items-center justify-between border-b px-6 py-3">
        <span className="font-medium">Insiders CRUD</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.name}</span>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>
      {children}
    </>
  );
}
