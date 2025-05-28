import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['user_registered', 'tour_completed', 'subscription', 'restaurant_created'],
        required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const notificationModel = mongoose.model("notification", notificationSchema);