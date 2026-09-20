import { NextRequest } from "next/server";
import { db } from "@/db";
import { stockItems, books, warehouses, stockMovements } from "@/db/schema";
import { eq, and, sql, lt } from "drizzle-orm";
import {
  requireAuth,
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const warehouseId = searchParams.get("warehouseId");
    const lowStock = searchParams.get("low") === "true";

    let query = db
      .select({
        id: stockItems.id,
        bookId: stockItems.bookId,
        bookTitle: books.title,
        bookFormat: books.format,
        bookIsbn: books.isbn,
        warehouseId: stockItems.warehouseId,
        warehouseName: warehouses.name,
        quantity: stockItems.quantity,
        safetyStock: stockItems.safetyStock,
        reorderPoint: stockItems.reorderPoint,
        lastUpdated: stockItems.lastUpdated,
      })
      .from(stockItems)
      .innerJoin(books, eq(stockItems.bookId, books.id))
      .innerJoin(warehouses, eq(stockItems.warehouseId, warehouses.id))
      .where(eq(stockItems.tenantId, session.tenantId));

    const results = await query;
    let filtered = results;

    if (bookId) {
      filtered = filtered.filter((r) => r.bookId === bookId);
    }
    if (warehouseId) {
      filtered = filtered.filter((r) => r.warehouseId === warehouseId);
    }
    if (lowStock) {
      filtered = filtered.filter((r) => r.quantity <= r.reorderPoint);
    }

    return successResponse(filtered);
  } catch (error) {
    return handleApiError(error);
  }
}