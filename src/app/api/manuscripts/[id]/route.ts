import { NextRequest } from "next/server";
import { db } from "@/db";
import { manuscripts, chapters, aiSuggestions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  requireAuth,
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [manuscript] = await db
      .select()
      .from(manuscripts)
      .where(
        and(eq(manuscripts.id, id), eq(manuscripts.tenantId, session.tenantId))
      )
      .limit(1);

    if (!manuscript) {
      return errorResponse("Manuscript not found", 404);
    }

    const manuscriptChapters = await db
      .select()
      .from(chapters)
      .where(eq(chapters.manuscriptId, id));

    const suggestions = await db
      .select()
      .from(aiSuggestions)
      .where(eq(aiSuggestions.manuscriptId, id));

    return successResponse({
      ...manuscript,
      chapters: manuscriptChapters,
      suggestions,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(manuscripts)
      .set({
        title: body.title,
        genre: body.genre,
        synopsis: body.synopsis,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(
        and(eq(manuscripts.id, id), eq(manuscripts.tenantId, session.tenantId))
      )
      .returning();

    if (!updated) {
      return errorResponse("Manuscript not found", 404);
    }

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    await db
      .delete(manuscripts)
      .where(
        and(eq(manuscripts.id, id), eq(manuscripts.tenantId, session.tenantId))
      );

    return successResponse({ message: "Manuscript deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}