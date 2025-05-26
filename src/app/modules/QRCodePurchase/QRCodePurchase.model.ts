import mongoose from "mongoose";
    
    const QRCodePurchaseSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const QRCodePurchaseModel = mongoose.model("QRCodePurchase", QRCodePurchaseSchema);