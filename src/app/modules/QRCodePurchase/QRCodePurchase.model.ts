import mongoose from "mongoose";

const QRCodePurchaseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    qrCodeDesign: { type: mongoose.Schema.Types.ObjectId, ref: 'QrCodeDesign', required: true },
    price: { type: Number, required: true },
    tableQuantity: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved',  'processing',  'completed', 'cancel'],
        default: 'pending',
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paymentIntentId: {
        type: String,
        required: false,
    },
   
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const QRCodePurchaseModel = mongoose.model("QRCodePurchase", QRCodePurchaseSchema);