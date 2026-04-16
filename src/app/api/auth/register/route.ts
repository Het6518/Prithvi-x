import { NextResponse } from "next/server";
import { z } from "zod";
import { authCookieName, signAuthToken } from "@/lib/auth";
import { createUserAccount } from "@/lib/dashboard-data";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["DEALER", "STAFF"])
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });
  }

  try {
    const user = await createUserAccount(parsed.data);
    const token = await signAuthToken({
      sub: user.id,
      role: user.role,
      name: user.name
    });

    const response = NextResponse.json({ ok: true, user: { name: user.name, email: user.email, role: user.role } }, { status: 201 });
    response.cookies.set(authCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create account." },
      { status: 400 }
    );
  }
}
