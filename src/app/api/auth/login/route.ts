import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signToken, hashPassword } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse("Email and password are required");
    }

    const hashedPw = hashPassword(password);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || user.passwordHash !== hashedPw) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = await signToken({
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    return successResponse({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      tenantId: user.tenantId,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Login failed", 500);
  }
}