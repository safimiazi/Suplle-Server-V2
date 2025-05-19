import mongoose, { Schema, model, Document, Types } from "mongoose";
import { ITable } from "./table.interface";


const TableSchema = new Schema<ITable>(
  {
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    tableName: { type: String, required: true },
    tableSetting: { type: String, required: true }, 
    seatingCapacity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey:false
  }
);

export const TableModel = model<ITable>("Table", TableSchema);
