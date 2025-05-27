import { Schema, model, Document, Types } from "mongoose";

export interface IMonthlyRevenue extends Document {
  restaurant: Types.ObjectId;
  month: string;
  totalRevenue: number;
}

const MonthlyRevenueSchema = new Schema<IMonthlyRevenue>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    month: {
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

MonthlyRevenueSchema.index({ restaurant: 1, month: 1 }, { unique: true });

export const MonthlyRevenueModel = model<IMonthlyRevenue>("MonthlyRevenue", MonthlyRevenueSchema);
