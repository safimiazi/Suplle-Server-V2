import { Types } from "mongoose";

export interface IOwner {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;
  businessName: string;
  businessEmail: string;
  referralCode: string;
  status: "pending" | "active" | "rejected" | "unverified";
  taxInfo: {
    gstRate: string;
    cgstRate: string;
    sgstRate: string;
  };
  isDeleted: boolean;

}
