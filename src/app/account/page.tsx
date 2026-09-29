"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <div className="mx-4 md:mx-10 mt-16 mb-16 text-center text-sm text-ink/50">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-4 md:mx-10 mt-16 mb-16 bg-cream py-16 text-center">
        <h1 className="text-xl font-semibold">Sign in required</h1>
        <p className="mt-2 text-sm text-ink/60">Sign in to manage your account.</p>
        <Link
          href="/login"
          className="mt-6 inline-block bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="px-4 pt-10 md:px-10">
      <h1 className="display-type text-5xl text-ink md:text-6xl">My account</h1>
      <p className="mt-2 text-sm text-ink/60">Signed in as {user.email}</p>

      <div className="mt-10 w-full max-w-sm border-t border-ink/10 pt-8">
        <h2 className="text-lg font-semibold text-ink">Change password</h2>

        {error && (
          <p className="mt-4 bg-red-500/10 px-4 py-2 text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="mt-4 bg-green-500/10 px-4 py-2 text-sm text-green-600">
            Password updated successfully.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="current-password" className="text-sm font-medium text-ink/80">Current Password</label>
            <PasswordInput id="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="text-sm font-medium text-ink/80">New Password</label>
            <PasswordInput id="new-password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirm-new-password" className="text-sm font-medium text-ink/80">Confirm New Password</label>
            <PasswordInput id="confirm-new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
