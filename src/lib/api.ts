import { NextResponse } from "next/server";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function isPlaceholderEnv(value?: string | null) {
  if (!value) return true;
  return (
    value.includes("YOUR_") ||
    value.includes("password@aws-1-region") ||
    value.includes("[YOUR-PASSWORD]") ||
    value.includes("SUPABASE_CONNECTION_STRING")
  );
}
