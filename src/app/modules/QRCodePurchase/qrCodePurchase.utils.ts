 // adjust the path as needed

import { QRCodePurchaseModel } from "./QRCodePurchase.model";

const findLastQRCodeOrderId = async (): Promise<string | undefined> => {
  const lastPurchase = await QRCodePurchaseModel.findOne({}, { orderId: 1 })
    .sort({ createdAt: -1 })
    .select('-_id')
    .lean();

  if (lastPurchase?.orderId) {
    const match = lastPurchase.orderId.match(/#(\d+)/); // extracts number after #
    if (match) {
      return match[1]; // return only the number string
    }
  }

  return undefined;
};

export const generateQRCodeOrderId = async (): Promise<string> => {
  let currentId = '0';

  const lastOrderId = await findLastQRCodeOrderId();
  if (lastOrderId) {
    currentId = lastOrderId;
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  return `Order #${incrementId}`;
};
