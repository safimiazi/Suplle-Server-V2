// middleware/checkSubscription.ts
import { Request, Response, NextFunction } from "express";
import { subscriptionModel } from "../modules/subscription/subscription.model";
import { RestaurantModel } from "../modules/restuarant/restuarant.model";
import { OwnerModel } from "../modules/users/owner/owner.model";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { error } from "console";
import { FloorModel } from "../modules/floor/floor.model";
import { tableModel } from "../modules/table/table.model";
import { MenuModel } from "../modules/menu/menu.model";
import { UserModel } from "../modules/users/user/users.model";

export const checkActiveSubscription = (allowFeature?: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;

    const owner = await OwnerModel.findOne({ user: user._id });

    if (!owner) {
      throw new AppError(404, "Owner not found. Please register as an owner first.");
    }

    const active: any = await subscriptionModel.findOne({
      user: user._id,
      status: "active",
      endDate: { $gt: new Date() },
    }).populate("user").populate("plan");

    if (!active) {
      throw new AppError(403, "No active subscription. Please subscribe.");
    }

    //  Restaurant:
    if (allowFeature === "maxRestaurants") {
      const restaurantCount = await RestaurantModel.countDocuments({
        owner: owner._id,
        isDeleted: { $ne: true },
      });
      if (restaurantCount >= active.plan.maxRestaurants) {
        throw new Error("You have reached your restaurant limit. Please upgrade your plan.");

      }
    }

    // FLoor: 
    if (active.plan.maxFloor !== null && allowFeature === "maxFloor") {
      const floorCount = await FloorModel.countDocuments({
        restaurant: user.selectedRestaurant,
        isDeleted: { $ne: true },
      });
      if (floorCount >= active.plan.maxFloor) {
        throw new Error("You have reached your floor limit. Please upgrade your plan.");

      }
    }
    // Table: 
    if (active.plan.maxTables !== null && allowFeature === "maxTables") {
      const tableCount = await tableModel.countDocuments({
        restaurant: user.selectedRestaurant,
        isDeleted: { $ne: true },
      });
      if (tableCount >= active.plan.maxTables) {
        throw new Error("You have reached your table limit. Please upgrade your plan.");

      }
    }
    // Menu: 
    if (active.plan.maxMenu !== null && allowFeature === "maxMenu") {
      const menuCount = await MenuModel.countDocuments({
        restaurant: user.selectedRestaurant,
        isDeleted: { $ne: true },
      });
      if (menuCount >= active.plan.maxMenu) {
        throw new Error("You have reached your menu limit. Please upgrade your plan.");

      }
    }


    // Menu upload via Excel file:
    if (
      allowFeature === "isMenuUploadViaExcel" &&
      active.plan?.isMenuUploadViaExcel === false
    ) {
      throw new AppError(403, "Excel file upload is not allowed in your current subscription plan.");
    }



    // Allow sub-user creation based on plan limits
    if (
      allowFeature === "isEccessSubUser" &&
      active.plan?.isEccessSubUser === false
    ) {
      throw new AppError(403, "Your current subscription plan does not allow adding sub-users. Please upgrade your plan.");
    } else if (
      allowFeature === "isEccessSubUser" &&
      active.plan?.isEccessSubUser === true
    ) {
      const subUserCount = await UserModel.countDocuments({
        restaurant: user.selectedRestaurant,
        isDeleted: { $ne: true },
      });


      if (subUserCount >= active.plan.maxUsers) {
        throw new AppError(
          403,
          `You have reached the maximum number of allowed sub-users (${active.plan.maxUsers}). Please upgrade your plan to add more.`
        );
      }
    }



    req.activeSubscription = active;
    next();
  });
