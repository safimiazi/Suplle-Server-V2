import { Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";

import sendResponse from "../../../utils/sendResponse";
import { AdminAnalyticService } from "./adminAnalytics.service";
import { RestaurantModel } from "../../restuarant/restuarant.model";



const AdminAnalytics = catchAsync(async (req: Request, res: Response) => {

 
    const result = await AdminAnalyticService.allAdminAnalytic();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Admin analytics data retrieved successfully",
        data: result,
      });
 
});

export const adminAnalyticController = {
    AdminAnalytics
};
