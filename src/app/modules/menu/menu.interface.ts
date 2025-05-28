import { Types } from "mongoose";

export type IMenuSize = "small" | "medium" | "large";

export interface IMenu {
  category: Types.ObjectId;
  restaurant: Types.ObjectId;
  itemName: string;
  image: string,
  price: number;
  size: IMenuSize;
  availability: string;
  description: string;
  rating: number;
  like: number;
  isDeleted: boolean;
}
