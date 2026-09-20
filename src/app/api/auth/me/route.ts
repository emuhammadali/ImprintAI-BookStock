import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return errorResponse("Not authenticated", 401);
  }
  return successResponse(session);
}