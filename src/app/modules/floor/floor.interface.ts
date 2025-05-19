import { Types } from "mongoose";

export interface IFloor {
  restaurant: Types.ObjectId;
  floorName: string;
  isDeleted: boolean;
}
