import { Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import { allAnalytic } from "./analytic.service";
import sendResponse from "../../../../utils/sendResponse";
import { UserModel } from "../../../users/user/users.model";
import { getSelectedRestaurantId } from "../../../../utils/getSelectedRestaurant";



const analytics = catchAsync(async (req: Request, res: Response) => {

    const user: any = req.user;

    const restaurant = await getSelectedRestaurantId(user._id);

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
