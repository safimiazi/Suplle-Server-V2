import { Types } from "mongoose";

export interface IRestaurantZone {
  restaurant: Types.ObjectId;
  tableName: string;
  tableSetting: string;
  seatingCapacity: number;
  isDeleted: boolean;
  zoneName: string;
  zoneType: string;
}
