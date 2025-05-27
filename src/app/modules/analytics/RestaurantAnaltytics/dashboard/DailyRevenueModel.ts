import { Schema, model, Document, Types } from "mongoose";

export interface IDailyRevenue extends Document {
  restaurant: Types.ObjectId;
  date: string; // Format: 'YYYY-MM-DD'
  totalRevenue: number;
}

const DailyRevenueSchema = new Schema<IDailyRevenue>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    date: {
      type: String,
      required: true, 
    },
    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

DailyRevenueSchema.index({ restaurant: 1, date: 1 }, { unique: true });

export const DailyRevenueModel = model<IDailyRevenue>("DailyRevenue", DailyRevenueSchema);
