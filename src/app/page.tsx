import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="inline-block rounded-full bg-tertiary-container/30 px-3 py-1 font-mono text-xs font-medium text-tertiary">
          NOVERAOS FOUNDATION v0.1.0
        </div>

        <h1 className="font-hanken text-4xl font-semibold tracking-tight sm:text-5xl text-foreground">
          Warm Minimalist AI Operating System
        </h1>

        <p className="font-sans text-lg text-muted-foreground leading-relaxed">
          Frictionless thought capture and RAG-grounded workspace synthesis.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="rounded-DEFAULT bg-primary px-6 py-3 font-sans text-sm font-medium text-primary-foreground transition-transform active:scale-95 shadow-sm"
          >
            Sign In
          </Link>

          <Link
            href="/dashboard"
            className="rounded-DEFAULT bg-secondary-container px-6 py-3 font-sans text-sm font-medium text-on-secondary-container transition-transform active:scale-95"
          >
            Open Workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
