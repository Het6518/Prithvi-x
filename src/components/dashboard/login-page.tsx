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
    <main className="min-h-screen bg-background">
      <div className="section-shell grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <p className="neo-eyebrow">Secure access</p>
          <h1 className="font-heading text-5xl leading-tight text-forest sm:text-6xl">
            Create an account, then step straight into the Prithvix control room.
          </h1>
          <p className="max-w-xl text-lg font-medium leading-8 text-forest/70">
            New users can register as dealers or staff, and existing users can log in with the same secure JWT-based flow.
          </p>
          <div className="max-w-lg">
            <LazyGlobe />
          </div>
        </div>

        <div className="neo-card p-8">
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
                className={`border-3 border-black px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  authMode === item ? "bg-forest text-background shadow-neo" : "bg-white text-forest hover:shadow-neo-sm"
                }`}
                style={{ borderRadius: "6px" }}
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
                className={`border-3 border-black px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  roleMode === item ? "bg-gold text-ink shadow-neo" : "bg-white text-forest hover:shadow-neo-sm"
                }`}
                style={{ borderRadius: "6px" }}
              >
                {item}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {authMode === "register" ? (
              <div>
                <label htmlFor="name" className="neo-label">Full name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neo-input"
                  placeholder="Your name"
                />
              </div>
            ) : null}
            <div>
              <label htmlFor="identifier" className="neo-label">Email</label>
              <input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="neo-input"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="neo-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neo-input"
                placeholder={authMode === "register" ? "Minimum 6 characters" : "Your password"}
              />
            </div>
            {error ? <div className="neo-toast">{error}</div> : null}
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
          <div className="mt-5 border-2 border-black/20 bg-gold/10 p-3 text-sm font-medium text-forest" style={{ borderRadius: "6px" }}>
            Demo login: <code className="font-bold">dealer@prithvix.com</code> or <code className="font-bold">staff@prithvix.com</code>, password <code className="font-bold">demo1234</code>
          </div>
          <Link href="/" className="mt-6 inline-flex text-sm font-bold text-forest underline underline-offset-4 hover:text-gold">
            Return to marketing site
          </Link>
        </div>
      </div>
    </main>
  );
}
