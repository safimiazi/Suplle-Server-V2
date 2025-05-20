import mongoose from "mongoose";

const QrCodeDesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Available", "ComingSoon", "Unavailable"],
      default: "Available",
    },
    image: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      default: "Admin",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const QrCodeDesignModel = mongoose.model(
  "QrCodeDesign",
  QrCodeDesignSchema
);
