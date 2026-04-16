import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findUserByIdentifier } from "@/lib/dashboard-data";
import { authCookieName, signAuthToken } from "@/lib/auth";

const schema = z.object({
  identifier: z.string().email(),
  password: z.string().min(4)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials format." }, { status: 400 });
  }

  const user = await findUserByIdentifier(parsed.data.identifier);
  if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await signAuthToken({
    sub: user.id,
    role: user.role as "DEALER" | "STAFF",
    name: user.name
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(authCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
