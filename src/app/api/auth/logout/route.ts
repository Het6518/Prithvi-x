import { NextRequest, NextResponse } from "next/server";
import { authCookieName } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(authCookieName, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0)
  });
  return response;
}
