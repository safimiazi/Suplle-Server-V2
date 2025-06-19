import mongoose, { Types } from "mongoose";


const notificationSchema = new mongoose.Schema({
    user: { type: Types.ObjectId, ref: "User", required: false },
    type: {
        type: String,
        required: true,
    },
    message: { type: String, required: true },
    status: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const notificationModel = mongoose.model("notification", notificationSchema);