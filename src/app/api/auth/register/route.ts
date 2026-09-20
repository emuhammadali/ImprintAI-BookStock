import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signToken, hashPassword } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { REGISTERABLE_ROLES } from "@/lib/constants";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, tenantName, role } =
      await request.json();

    // ✅ Basic validation
    if (!email || !password || !tenantName) {
      return errorResponse("Missing required fields");
    }

    // ✅ Role validation (sahi tarika)
    const allowedRoles = REGISTERABLE_ROLES.map((r) => r.value);
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 }
      );
    }

    // Check existing user
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return errorResponse("Email already registered");
    }

    // Create tenant
    const slug = tenantName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const [tenant] = await db
      .insert(tenants)
      .values({
        name: tenantName,
        slug: slug + "-" + Date.now().toString(36),
        plan: "free",
      })
      .returning();

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        tenantId: tenant.id,
        email,
        passwordHash: hashPassword(password),
        firstName,
        lastName,
        role: role || "author",
      })
      .returning();

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
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return successResponse({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      tenantId: user.tenantId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse("Registration failed", 500);
  }
}