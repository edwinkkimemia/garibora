import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <p className="text-6xl">🚗💨</p>
      <h2 className="mt-4 text-2xl font-extrabold">Hiyo gari haipo — car not found</h2>
      <p className="mt-2 text-muted-foreground">It may have been sold. Try a fresh search.</p>
      <Link href="/cars" className="mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Back to cars</Link>
    </div>
  );
}
