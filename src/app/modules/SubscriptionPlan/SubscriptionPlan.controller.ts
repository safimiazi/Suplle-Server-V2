import { Request, Response } from "express";
import { SubscriptionPlanService } from "./SubscriptionPlan.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const postSubscriptionPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionPlanService.postSubscriptionPlanIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created subscription plan successfully",
    data: result,
  });
});

const getAllSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionPlanService.getAllSubscriptionPlanFromDB(
      req.query
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Fetched successfully",
      data: result,
    });
  }
);

const getSingleSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SubscriptionPlanService.getSingleSubscriptionPlanFromDB(
        req.params.id
      );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Fetched successfully",
      data: result,
    });
  }
);

const updateSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await SubscriptionPlanService.updateSubscriptionPlanIntoDB(
      req.body, id
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Updated successfully",
      data: result,
    });
  }
);

const deleteSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    await SubscriptionPlanService.deleteSubscriptionPlanFromDB(req.params.id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Deleted successfully",
      data: null,
    });
  }
);

export const SubscriptionPlanController = {
  postSubscriptionPlan,
  getAllSubscriptionPlan,
  getSingleSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
};
