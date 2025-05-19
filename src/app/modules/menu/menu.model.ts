import { Schema, model, Document, Types } from "mongoose";
import { IMenu } from "./menu.interface";


const MenuSchema = new Schema<IMenu>(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    itemName: { type: String, required: true},
    image: {
      type: String,
      default: "",
    },
    price: { type: Number, required: true },
    size: {
      type: String,
      enum: ["small", "medium", "large"],
      required: true,
    },
    availability: { type: Boolean, default: true },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey:false
  }
);


MenuSchema.index({ restaurant: 1, itemName: 1 }, { unique: true });



export const MenuModel = model<IMenu>("Menu", MenuSchema);
