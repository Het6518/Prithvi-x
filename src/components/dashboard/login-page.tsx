"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/button";
import { LazyGlobe } from "@/components/shared/lazy-globe";

type AuthMode = "login" | "register";
type UserRoleMode = "dealer" | "staff";

export function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [roleMode, setRoleMode] = useState<UserRoleMode>("dealer");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("dealer@prithvix.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body =
      authMode === "login"
        ? {
            identifier,
            password
          }
        : {
            name,
            email: identifier,
            password,
            role: roleMode.toUpperCase()
          };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || `${authMode === "login" ? "Login" : "Registration"} failed.`);
      setLoading(false);
      return;
    }

    router.push(searchParams.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(212,168,83,0.18),transparent_22%),linear-gradient(180deg,#F5F0E8,#EFE8DD)]">
      <div className="section-shell grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.32em] text-gold">Secure access</p>
          <h1 className="font-heading text-5xl leading-tight text-forest sm:text-6xl">
            Create an account, then step straight into the Prithvix control room.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-forest/70">
            New users can register as dealers or staff, and existing users can log in with the same secure JWT-based flow.
          </p>
          <div className="max-w-lg">
            <LazyGlobe />
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-8 shadow-ambient">
          <div className="grid gap-3 sm:grid-cols-2">
            {(["login", "register"] as const).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setAuthMode(item);
                  setError("");
                  if (item === "login") {
                    setIdentifier(roleMode === "dealer" ? "dealer@prithvix.com" : "staff@prithvix.com");
                    setPassword("demo1234");
                  } else {
                    setName("");
                    setIdentifier("");
                    setPassword("");
                  }
                }}
                className={`rounded-full px-5 py-3 text-sm font-semibold capitalize ${
                  authMode === item ? "bg-forest text-background" : "bg-white/75 text-forest"
                }`}
              >
                {item === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            {(["dealer", "staff"] as const).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setRoleMode(item);
                  if (authMode === "login") {
                    setIdentifier(item === "dealer" ? "dealer@prithvix.com" : "staff@prithvix.com");
                    setPassword("demo1234");
                  }
                }}
                className={`rounded-full px-5 py-3 text-sm font-semibold capitalize ${
                  roleMode === item ? "bg-gold text-ink" : "bg-white/75 text-forest"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {authMode === "register" ? (
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-forest/70">Full name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                  placeholder="Your name"
                />
              </div>
            ) : null}
            <div>
              <label htmlFor="identifier" className="mb-2 block text-sm font-medium text-forest/70">Email</label>
              <input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-forest/70">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                placeholder={authMode === "register" ? "Minimum 6 characters" : "Your password"}
              />
            </div>
            {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}
            <Button className="w-full" disabled={loading}>
              <span className="inline-flex items-center gap-2">
                {loading
                  ? authMode === "login"
                    ? "Signing in..."
                    : "Creating account..."
                  : authMode === "login"
                    ? "Enter Dashboard"
                    : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </form>
          <p className="mt-5 text-sm text-forest/55">
            Demo login: `dealer@prithvix.com` or `staff@prithvix.com`, password `demo1234`.
          </p>
          <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-forest underline-offset-4 hover:underline">
            Return to marketing site
          </Link>
        </div>
      </div>
    </main>
  );
}
