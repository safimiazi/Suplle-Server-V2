import { Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import { allAnalytic } from "./analytic.service";
import sendResponse from "../../../../utils/sendResponse";



const analytics = catchAsync(async (req: Request, res: Response) => {

    const user: any = req.user;
    const restaurantId = user.selectedRestaurant;



    const result = await allAnalytic(restaurantId)

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
