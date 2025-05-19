import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IRestaurant } from "./restuarant.interface";

const RestaurantSchema = new Schema<IRestaurant>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "Owner", required: false },
    restaurantName: { type: String, required: true },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }]
    ,
    status: {
      type: String,
      default: "pending",
    },
    restaurantAddress: { type: String, required: true },
    phone: { type: String, required: true },
    logo: { type: String, default: null },
    tagline: { type: String },
    coverPhoto: { type: String },
    images: [{ type: String }],
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const RestaurantModel = model<IRestaurant>(
  "Restaurant",
  RestaurantSchema
);
