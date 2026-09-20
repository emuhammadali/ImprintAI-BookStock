import { db } from "@/db";
import { sql } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return successResponse({
      status: "healthy",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        api: "running",
      },
    });
  } catch {
    return errorResponse("Database connection failed", 503);
  }
}