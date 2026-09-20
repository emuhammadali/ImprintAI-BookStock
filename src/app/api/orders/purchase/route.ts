import { NextRequest } from "next/server";
import { db } from "@/db";
import { purchaseOrders, purchaseOrderItems } from "@/db/schema";
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
    const orders = await db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.tenantId, session.tenantId))
      .orderBy(desc(purchaseOrders.createdAt));
    return successResponse(orders);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const { supplierId, warehouseId, items, expectedDelivery, notes } = body;

    if (!supplierId || !warehouseId || !items?.length) {
      return errorResponse("Missing required fields");
    }

    // Calculate total
    let totalCost = 0;
    for (const item of items) {
      totalCost += parseFloat(item.unitCost) * item.quantity;
    }

    const [order] = await db
      .insert(purchaseOrders)
      .values({
        tenantId: session.tenantId,
        supplierId,
        warehouseId,
        totalCost: totalCost.toFixed(2),
        expectedDelivery: expectedDelivery
          ? new Date(expectedDelivery)
          : null,
        notes: notes || null,
        status: "draft",
      })
      .returning();

    for (const item of items) {
      await db.insert(purchaseOrderItems).values({
        poId: order.id,
        bookId: item.bookId,
        quantity: item.quantity,
        unitCost: item.unitCost,
      });
    }

    return successResponse(order, 201);
  } catch (error) {
    return handleApiError(error);
  }
}