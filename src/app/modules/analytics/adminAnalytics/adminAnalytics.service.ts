import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import { OrderModel } from "../../order/order.model";
import { RestaurantModel } from "../../restuarant/restuarant.model";
import { userModel } from "../../users/user/users.model";


const allAdminAnalytic = async () => {
    const totalRestaurant = await RestaurantModel.find({});
    const totalOrder = await OrderModel.find({});
    const totalUser = await userModel.find({});
  
    return {
      totalRestaurants: totalRestaurant?.length || 0,
      totalOrders: totalOrder?.length || 0,
      totalUsers: totalUser?.length || 0
    };
  };
  



export const AdminAnalyticService = {
    allAdminAnalytic,

};
