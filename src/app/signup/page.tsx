"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeRedirect } from "@/lib/redirect";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeRedirect(searchParams.get("next"));
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    await refresh();
    router.push(next);
  };

  return (
    <div className="flex justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-sm">
        <h1 className="display-type text-4xl text-ink">Create an account</h1>
        <p className="mt-2 text-sm text-ink/60">It takes a minute, and your orders are saved to it.</p>

        {error && (
          <p className="mt-4 bg-red-500/10 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="full-name" className="text-sm font-medium text-ink/80">
              Full Name
            </label>
            <input
              id="full-name"
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink/80">
              Email
            </label>
            <input
              id="email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-ink/80">
              Password
            </label>
            <PasswordInput
              id="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
            />
            <p className="mt-1 text-xs text-ink/40">At least 8 characters.</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          Already have an account?{" "}
          <Link
            href={next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`}
            className="font-medium text-ink underline underline-offset-4 hover:text-gold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
