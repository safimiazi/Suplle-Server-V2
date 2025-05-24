import mongoose from "mongoose";
    
    const subscriptionSchema = new mongoose.Schema( {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true });
    
    export const subscriptionModel = mongoose.model("subscription", subscriptionSchema);