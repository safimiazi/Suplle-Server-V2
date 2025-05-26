import { OrderModel } from "../order.model";


const findLastOrderId = async (): Promise<string | undefined> => {
  const lastOrder = await OrderModel.findOne({}, { orderId: 1 })
    .sort({ createdAt: -1 })
    .select('-_id')
    .lean();

  return lastOrder?.orderId ? lastOrder.orderId.substring(4) : undefined;
};

export const generateOrderId = async (): Promise<string> => {
  let currentId = '0';

  const lastOrderId = await findLastOrderId();
  if (lastOrderId) {
    currentId = lastOrderId;
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  return `ORD-${incrementId}`;
};
