import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api";
import type { AppUserRole } from "@/lib/types";

const COOKIE_NAME = "prithvix_token";

export type AuthPayload = {
  sub: string;
  role: AppUserRole;
  name: string;
};

function getSecret() {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(payload: AuthPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as AuthPayload;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function getTokenFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function requireRequestUser(request: NextRequest) {
  const user = await getTokenFromRequest(request);
  if (!user) {
    return { user: null, response: jsonError("Unauthorized.", 401) };
  }

  return { user, response: null };
}

export const authCookieName = COOKIE_NAME;
