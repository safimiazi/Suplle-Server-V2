import { OrderModel } from "../order.model";


export const generateOrderId = async (restaurantId: string): Promise<string> => {
  // Find the latest order for the specific restaurant
  const lastOrder = await OrderModel.findOne({ restaurant: restaurantId })
    .sort({ createdAt: -1 })
    .select("orderId");

  let lastNumericPart = 0;

  if (lastOrder?.orderId) {
    // Extract numeric part from the orderId string, e.g., "ORD-0007" -> 7
    const match = lastOrder.orderId.match(/ORD-(\d+)/);
    if (match) {
      lastNumericPart = parseInt(match[1], 10);
    }
  }

  // Increment the ID
  const nextId = (lastNumericPart + 1).toString().padStart(4, "0");

  return `ORD-${nextId}`;
};
