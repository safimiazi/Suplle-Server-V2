import { Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import { allAnalytic } from "./analytic.service";
import sendResponse from "../../../../utils/sendResponse";
import { UserModel } from "../../../users/user/users.model";



const analytics = catchAsync(async (req: Request, res: Response) => {

    const user: any = req.user;
    const restaurantData = await UserModel.findOne({ _id: user._id });

    const restaurant = restaurantData?.selectedRestaurant;

    const result = await allAnalytic(restaurant as unknown as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Restaurant Analytics data retrieved successfully",
        data: result,
    });

});

export const analyticController = {
    analytics
};
