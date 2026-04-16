"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/shared/button";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="secondary"
      className="mt-5 w-full border-white/10 bg-white/10 text-background hover:bg-white/15"
      onClick={handleLogout}
      disabled={loading}
    >
      <span className="inline-flex items-center gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        {loading ? "Logging out..." : "Logout"}
      </span>
    </Button>
  );
}
