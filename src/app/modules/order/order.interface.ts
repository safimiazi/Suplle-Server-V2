import { Types } from "mongoose";

export interface IOrder {
  restaurant: Types.ObjectId;
  zone: Types.ObjectId;
  menus: Types.ObjectId[]; // Array of Menu IDs
  customerName: string;
  customerPhone: string;
  orderType: "dine in" | "takeaway";
  status: "pending" | "inProgress" | "delivered" | "cancel";
  specialRequest: string;
  total: number;
  isDeleted: boolean;
}
