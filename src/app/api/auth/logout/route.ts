import { cookies } from "next/headers";
import { successResponse } from "@/lib/api-utils";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return successResponse({ message: "Logged out" });
}