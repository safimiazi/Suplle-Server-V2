import { Schema, model } from "mongoose";
import { IRestaurantZone } from "./restaurantZone.interface";

const RestaurantZoneSchema = new Schema<IRestaurantZone>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    tableName: { type: String, required: true },
    tableSetting: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    zoneName: { type: String, required: true },
    zoneType: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
RestaurantZoneSchema.index({ restaurant: 1, tableName: 1 }, { unique: true });

export const RestaurantZone = model<IRestaurantZone>(
  "RestaurantZone",
  RestaurantZoneSchema
);
