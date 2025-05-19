import { Types } from "mongoose";

export interface ITable {
  restaurant: Types.ObjectId;
  tableName: string;
  tableSetting: string;
  seatingCapacity: number;
  isDeleted: boolean;
}
