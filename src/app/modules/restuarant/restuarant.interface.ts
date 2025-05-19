import { Types } from "mongoose";

export interface IRestaurant {
  owner: Types.ObjectId;
  restaurantName: string;
  menus: Types.ObjectId[] | [],
  restaurantAddress: string;
  phone: string;
  status: "active" | "pending" | "cancelled";
  logo?: string; 
  tagline: string;
  coverPhoto: string;
  images: string[];
  description: string;
  isDeleted?: boolean;
}
