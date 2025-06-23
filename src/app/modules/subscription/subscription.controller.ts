import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import Stripe from "stripe";
import { subscriptionModel } from "./subscription.model";
import { SubscriptionPlanModel } from "../SubscriptionPlan/SubscriptionPlan.model";
import { stripe } from "../../utils/stripe";




const createSubscriptionIntent = catchAsync(async (req: Request, res: Response) => {
  const { planId, months = 1 } = req.body;
  const userId = (req.user as any)?._id;


  const plan = await SubscriptionPlanModel.findById(planId);
  if (!plan) {
    res.status(404).json({ error: 'Plan not found' });
    return;
  }

  const amount = Math.round(plan.price * months * 100); // USD cents


  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: {
      userId: userId.toString(),
      planId: plan._id.toString(),
      months: months.toString(),
    },
    automatic_payment_methods: { enabled: true },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

const activateSubscription = catchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  // 1. Retrieve PaymentIntent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment not successful yet. Please try again.')
  }

  const { userId, planId, months } = paymentIntent.metadata;

  // 2. Validate plan
  const plan = await SubscriptionPlanModel.findById(planId);
  if (!plan) {
    throw new Error('Subscription plan not found.')
  }

  // 3. Check if user has active subscription
  const now = new Date();
  const existing = await subscriptionModel.findOne({
    user: userId,
    status: 'active',
  });

  // 4. If active, extend it
  if (existing && existing.endDate > now) {
    existing.endDate = new Date(existing.endDate.setMonth(
      existing.endDate.getMonth() + parseInt(months)
    ));

    await existing.save();

    sendResponse(res, {
      statusCode: status.OK, success: true, message: `Existing subscription extended by ${months} month(s).`, data: {
        newEndDate: existing.endDate,
      }
    });
  }

  // 5. Create new subscription
  const startDate = now;
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + parseInt(months));

  const newSub = await subscriptionModel.create({
    user: userId,
    plan: planId,
    startDate,
    endDate,
    status: "active"
  });



  sendResponse(res, {
    statusCode: status.OK, success: true, message: ' New subscription activated successfully.', data: {
      id: newSub._id,
      plan: plan.name,
      startDate,
      endDate,
      months: parseInt(months),
    }
  });

});










export const subscriptionController = { createSubscriptionIntent, activateSubscription };
