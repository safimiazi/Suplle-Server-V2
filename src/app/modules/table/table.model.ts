import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    name: {
        type: String, requireed: true
    },
    capacity: {
        type: Number,
        required: true,
    },
    floor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    qrCodeUrl: {
        type: String
    },

    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const tableModel = mongoose.model("table", tableSchema);