import { NextRequest } from "next/server";
import { db } from "@/db";
import { stockItems, stockMovements } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import {
  requireAuth,
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const { bookId, warehouseId, movementType, quantity, notes } = body;

    if (!bookId || !warehouseId || !movementType || quantity === undefined) {
      return errorResponse("Missing required fields");
    }

    // Record the movement (append-only)
    const [movement] = await db
      .insert(stockMovements)
      .values({
        tenantId: session.tenantId,
        bookId,
        warehouseId,
        movementType,
        quantity,
        notes: notes || null,
        performedBy: session.id,
      })
      .returning();

    // Update stock quantity atomically
    if (movementType === "received" || movementType === "returned") {
      // Increase stock
      await db
        .update(stockItems)
        .set({
          quantity: sql`${stockItems.quantity} + ${Math.abs(quantity)}`,
          lastUpdated: new Date(),
        })
        .where(
          and(
            eq(stockItems.bookId, bookId),
            eq(stockItems.warehouseId, warehouseId),
            eq(stockItems.tenantId, session.tenantId)
          )
        );
    } else if (
      movementType === "sold" ||
      movementType === "transferred" ||
      movementType === "damaged"
    ) {
      // Decrease stock (atomic - prevent overselling)
      const [stockItem] = await db
        .select()
        .from(stockItems)
        .where(
          and(
            eq(stockItems.bookId, bookId),
            eq(stockItems.warehouseId, warehouseId),
            eq(stockItems.tenantId, session.tenantId)
          )
        )
        .limit(1);

      if (!stockItem || stockItem.quantity < Math.abs(quantity)) {
        return errorResponse("Insufficient stock", 409);
      }

      await db
        .update(stockItems)
        .set({
          quantity: sql`${stockItems.quantity} - ${Math.abs(quantity)}`,
          lastUpdated: new Date(),
        })
        .where(
          and(
            eq(stockItems.bookId, bookId),
            eq(stockItems.warehouseId, warehouseId),
            eq(stockItems.tenantId, session.tenantId)
          )
        );
    }

    return successResponse(movement, 201);
  } catch (error) {
    return handleApiError(error);
  }
}