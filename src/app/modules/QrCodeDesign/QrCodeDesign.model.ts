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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

QrCodeDesignSchema.index({name: 1, category: 1}, {unique: true})

export const QrCodeDesignModel = mongoose.model(
  "QrCodeDesign",
  QrCodeDesignSchema
);
