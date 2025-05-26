// middleware/checkSubscription.ts
import { Request, Response, NextFunction } from "express";
import { subscriptionModel } from "../modules/subscription/subscription.model";
import { RestaurantModel } from "../modules/restuarant/restuarant.model";

export const checkActiveSubscription = (allowFeature?: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = req.user;

    const active: any = await subscriptionModel.findOne({
      user: user._id,
      status: 'active',
      endDate: { $gt: new Date() },
    }).populate("user").populate("plan");

    if (!active) {
      throw new Error("No active subscription. Please subscribe.");
    }


    //  check if the user has reached restaurant limit
    const restaurantCount = await RestaurantModel.countDocuments({
      owner: user._id,
      isDeleted: { $ne: true }
    })

    if (restaurantCount >= active.plan.maxRestaurants) {
      throw new Error("You have reached your restaurant limit. Please upgrade your plan.");
    }



    if (allowFeature && !active.plan.features.includes(allowFeature)) {
      throw new Error(`You do not have access this feature. Please upgrade your plan.`);
    }



    // Attach the active subscription to the request object for further use
    req.activeSubscription = active;

    next();
  } catch (error) {
    throw error;
  }
};