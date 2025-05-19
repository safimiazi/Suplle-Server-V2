import { Schema, model, Document, Types } from "mongoose";
import { IRestaurantLayout } from "./restaurantLayout.interface";

const RestaurantLayoutSchema = new Schema<IRestaurantLayout>(
  {
    floor: { type: Schema.Types.ObjectId, ref: "Floor", required: true },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    numberOfTables: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey:false
  }
);

export const RestaurantLayoutModel = model<IRestaurantLayout>(
  "RestaurantLayout",
  RestaurantLayoutSchema
);
