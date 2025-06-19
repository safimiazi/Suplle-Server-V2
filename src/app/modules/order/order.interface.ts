import { Types } from "mongoose";

export interface IOrder {
  _id?: Types.ObjectId;
  restaurant: Types.ObjectId;
  table: Types.ObjectId | string;
  floor: Types.ObjectId;
  orderId: string;
  menus: {
    menu: Types.ObjectId;
    quantity: number;
  }[];
  customerName: string;
  person: number;
  customerPhone: string;
  orderType: "dine in" | "take away";
  specialRequest?: string;
  total: number;
  paymentMethod: {
    type: "cash" | "card";
    cardNumber?: string | null
  };
  status?: "pending" | "inProgress" | "delivered" | "cancel";
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
