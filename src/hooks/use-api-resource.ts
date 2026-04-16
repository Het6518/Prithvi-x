"use client";

import { startTransition, useEffect, useState } from "react";

export function useApiResource<T>(url: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(url, {
        credentials: "include",
        cache: "no-store"
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Request failed.");
      }

      startTransition(() => {
        setData(payload);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: load,
    setData
  };
}
