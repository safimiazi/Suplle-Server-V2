import mongoose from "mongoose";
import AppError from "../errors/AppError"; 


export const toObjectId = (id: string): mongoose.Types.ObjectId => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, `Invalid ObjectId: ${id}`);
  }
  return new mongoose.Types.ObjectId(id);
};
