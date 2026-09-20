import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "imprintai-secret-key-change-in-production"
);

export interface UserPayload {
  id: string;
  tenantId: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

export async function signToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as UserPayload;
}

export async function getSession(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let hash = "";
  for (let i = 0; i < 60; i++) {
    hash += chars[(password.charCodeAt(i % password.length) + i) % chars.length];
  }
  return hash;
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}