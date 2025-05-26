import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import { OrderModel } from "../../order/order.model";
import { RestaurantModel } from "../../restuarant/restuarant.model";
import { UserModel } from "../../users/user/users.model";
import { QrCodeDesignModel } from "../../QrCodeDesign/QrCodeDesign.model";


const allAdminAnalytic = async () => {
    const totalRestaurant = await RestaurantModel.find({status: "active"});
    // const totalOrder = await OrderModel.find({});
    const totalUser = await UserModel.find({});
    // const qrOrder = await QrCodeDesignModel.find();
  
    return {
      totalRestaurants: totalRestaurant?.length || 0,
      // totalOrders: totalOrder?.length || 0,
      totalUsers: totalUser?.length || 0,
      // totalQrOrders: qrOrder?.length || 0,
    };
  };
  



export const AdminAnalyticService = {
    allAdminAnalytic,

};
