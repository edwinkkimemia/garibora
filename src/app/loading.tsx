export default function Loading() {
  return (
    <div className="container py-10">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-2xl border">
            <div className="aspect-[16/10] bg-muted" />
            <div className="space-y-2 p-4"><div className="h-4 rounded bg-muted" /><div className="h-4 w-1/2 rounded bg-muted" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
