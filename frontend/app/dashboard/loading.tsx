export default function DashboardLoading() {
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 animate-pulse">
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="h-8 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
      </header>

      {/* Task dashboard skeleton placeholder */}
      <div className="grid gap-4">
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    </main>
  );
}
