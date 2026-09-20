import { NextResponse } from "next/server";
import { getSession, type UserPayload } from "./auth";

export class ApiError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
  }
}

export async function requireAuth(): Promise<UserPayload> {
  const session = await getSession();
  if (!session) {
    throw new ApiError("Unauthorized", 401);
  }
  return session;
}

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode);
  }
  console.error("API Error:", error);
  return errorResponse("Internal server error", 500);
}

export function parseSearchParams(url: string) {
  const { searchParams } = new URL(url);
  return {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || "createdAt",
    order: (searchParams.get("order") || "desc") as "asc" | "desc",
  };
}