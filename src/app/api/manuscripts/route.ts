import { NextRequest } from "next/server";
import { db } from "@/db";
import { manuscripts, chapters } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
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
      .from(manuscripts)
      .where(eq(manuscripts.tenantId, session.tenantId))
      .orderBy(desc(manuscripts.updatedAt));
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

    const [manuscript] = await db
      .insert(manuscripts)
      .values({
        tenantId: session.tenantId,
        title: body.title,
        authorId: session.id,
        genre: body.genre || null,
        wordCount: body.wordCount || 0,
        synopsis: body.synopsis || null,
        status: "draft",
      })
      .returning();

    // Create first chapter if content provided
    if (body.content) {
      await db.insert(chapters).values({
        manuscriptId: manuscript.id,
        chapterNumber: 1,
        title: "Chapter 1",
        content: body.content,
        wordCount: body.content.split(/\s+/).length,
      });
    }

    return successResponse(manuscript, 201);
  } catch (error) {
    return handleApiError(error);
  }
}