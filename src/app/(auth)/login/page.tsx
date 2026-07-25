"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@noveraos.local");
  const [password, setPassword] = useState("novera2026");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials or your email is not in the private beta cohort.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[var(--color-background)]">
      <div className="w-full max-w-sm rounded-xl bg-card p-8 border border-border shadow-md">
        <div className="mb-6 text-center">
          <div className="inline-block rounded-full bg-tertiary-container/30 px-3 py-1 font-mono text-xs font-medium text-tertiary mb-3">
            PRIVATE BETA
          </div>
          <h1 className="font-hanken text-2xl font-semibold tracking-tight text-foreground">
            Sign In to NoveraOS
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            Access your Thought Dump & AI Workspace
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 font-sans text-xs text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-xs font-medium text-muted-foreground mb-1">
              Beta Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-medium text-muted-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-DEFAULT bg-primary py-2.5 font-sans text-sm font-medium text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Enter Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
