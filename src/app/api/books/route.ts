import { NextRequest } from "next/server";
import { db } from "@/db";
import { books } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  requireAuth,
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await requireAuth();
    const results = await db
      .select()
      .from(books)
      .where(eq(books.tenantId, session.tenantId))
      .orderBy(desc(books.createdAt));
    return successResponse(results);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    if (!body.title) {
      return errorResponse("Title is required");
    }

    const [book] = await db
      .insert(books)
      .values({
        tenantId: session.tenantId,
        title: body.title,
        isbn: body.isbn,
        authorId: body.authorId,
        manuscriptId: body.manuscriptId,
        genre: body.genre,
        format: body.format || "paperback",
        price: body.price || "0",
        costPrice: body.costPrice || "0",
        description: body.description,
      })
      .returning();

    return successResponse(book, 201);
  } catch (error) {
    return handleApiError(error);
  }
}