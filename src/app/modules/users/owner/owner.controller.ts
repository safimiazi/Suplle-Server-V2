import { Request, Response } from "express";
import { ownerService } from "./owner.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";

const postOwner = catchAsync(async (req: Request, res: Response) => {
  const result = await ownerService.postOwnerIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

const getAllOwner = catchAsync(async (req: Request, res: Response) => {
  const result = await ownerService.getAllOwnerFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getSingleOwner = catchAsync(async (req: Request, res: Response) => {
  const result = await ownerService.getSingleOwnerFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const updateOwner = catchAsync(async (req: Request, res: Response) => {
  const result = await ownerService.updateOwnerIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteOwner = catchAsync(async (req: Request, res: Response) => {
  await ownerService.deleteOwnerFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

export const ownerController = {
  postOwner,
  getAllOwner,
  getSingleOwner,
  updateOwner,
  deleteOwner,
};
