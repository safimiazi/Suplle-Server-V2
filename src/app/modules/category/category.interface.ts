import { Types } from "mongoose";

export interface ICategory {
  restaurant: Types.ObjectId;
  categoryName: string;
  description: string;
  image: string;
  isDeleted: boolean;
}
