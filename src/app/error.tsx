"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container py-20 text-center">
      <h2 className="text-2xl font-extrabold">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground">{error.message || "Please try again."}</p>
      <button onClick={reset} className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Try again</button>
    </div>
  );
}
