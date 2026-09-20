import { NextRequest } from "next/server";
import { db } from "@/db";
import {
  salesOrders,
  salesOrderItems,
  stockItems,
  stockMovements,
  books,
} from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import {
  requireAuth,
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await requireAuth();
    const orders = await db
      .select()
      .from(salesOrders)
      .where(eq(salesOrders.tenantId, session.tenantId))
      .orderBy(desc(salesOrders.createdAt));
    return successResponse(orders);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const { customerName, customerEmail, warehouseId, items, shippingAddress } =
      body;

    if (!customerName || !items?.length || !warehouseId) {
      return errorResponse("Missing required fields");
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    for (const item of items) {
      const [book] = await db
        .select()
        .from(books)
        .where(eq(books.id, item.bookId))
        .limit(1);
      if (!book) {
        return errorResponse(`Book ${item.bookId} not found`);
      }
      totalAmount += parseFloat(book.price) * item.quantity;
    }

    // Check stock availability atomically
    for (const item of items) {
      const [stock] = await db
        .select()
        .from(stockItems)
        .where(
          and(
            eq(stockItems.bookId, item.bookId),
            eq(stockItems.warehouseId, warehouseId),
            eq(stockItems.tenantId, session.tenantId)
          )
        )
        .limit(1);

      if (!stock || stock.quantity < item.quantity) {
        return errorResponse(
          `Insufficient stock for book ${item.bookId}`,
          409
        );
      }
    }

    // Create order
    const [order] = await db
      .insert(salesOrders)
      .values({
        tenantId: session.tenantId,
        customerName,
        customerEmail: customerEmail || null,
        warehouseId,
        totalAmount: totalAmount.toFixed(2),
        shippingAddress: shippingAddress || null,
        status: "pending",
      })
      .returning();

    // Create order items and deduct stock
    for (const item of items) {
      const [book] = await db
        .select()
        .from(books)
        .where(eq(books.id, item.bookId))
        .limit(1);

      await db.insert(salesOrderItems).values({
        salesOrderId: order.id,
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: book!.price,
      });

      // Deduct stock atomically
      await db
        .update(stockItems)
        .set({
          quantity: sql`${stockItems.quantity} - ${item.quantity}`,
          lastUpdated: new Date(),
        })
        .where(
          and(
            eq(stockItems.bookId, item.bookId),
            eq(stockItems.warehouseId, warehouseId),
            eq(stockItems.tenantId, session.tenantId),
            sql`${stockItems.quantity} >= ${item.quantity}`
          )
        );

      // Record stock movement
      await db.insert(stockMovements).values({
        tenantId: session.tenantId,
        bookId: item.bookId,
        warehouseId,
        movementType: "sold",
        quantity: -item.quantity,
        referenceId: order.id,
        performedBy: session.id,
      });
    }

    return successResponse(order, 201);
  } catch (error) {
    return handleApiError(error);
  }
}