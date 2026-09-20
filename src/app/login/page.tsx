"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEMO_ACCOUNTS = [
  { email: "author@demo.com", role: "Author", password: "demo123" },
  { email: "editor@demo.com", role: "Editor", password: "demo123" },
  { email: "publisher@demo.com", role: "Publisher", password: "demo123" },
  { email: "admin@demo.com", role: "Admin", password: "demo123" },
  { email: "beta@demo.com", role: "Beta Reader", password: "demo123" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push(`/dashboard/${data.data.role}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(account: (typeof DEMO_ACCOUNTS)[number]) {
    setEmail(account.email);
    setPassword(account.password);
  }

  return (
    <div className="min-h-screen grid-pattern flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xl">
              I
            </div>
            <span className="font-bold text-xl">
              ImprintAI + BookStock
            </span>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Welcome back to the future of publishing
          </h1>
          <p className="text-white/80 text-lg">
            AI editorial agents, blockchain rights, audiobook studio, market
            intelligence, and inventory management — all in one platform.
          </p>
        </div>
        <p className="text-white/50 text-sm">
          © 2025 ImprintAI + BookStock
        </p>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              I
            </div>
            <span className="font-bold text-lg">ImprintAI + BookStock</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Sign in to your account
          </h2>
          <p className="text-slate-500 mb-8">
            Enter your credentials or use a demo account below.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-50 text-slate-400">
                  Demo Accounts
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => fillDemo(account)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {account.role}
                    </div>
                    <div className="text-xs text-slate-500">
                      {account.email}
                    </div>
                  </div>
                  <span className="text-xs text-indigo-600 font-medium">
                    Use →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}