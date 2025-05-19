import { Request, Response } from "express";
import httpStatus from "http-status";
import { staffService } from "./staff.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

const createStaff = catchAsync(async (req: Request, res: Response) => {

  const data = JSON.parse(req.body.data);
  const uploadImage = req.file;
  console.log("11",uploadImage)
  const result = await staffService.createStaff(data,uploadImage as Express.Multer.File);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Staff created successfully",
    data: result,
  });
});

const getAllStaff = catchAsync(async (_req: Request, res: Response) => {
  const result = await staffService.getAllStaff();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All staff retrieved successfully",
    data: result,
  });
});

const getSingleStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await staffService.getSingleStaff(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Staff retrieved successfully",
    data: result,
  });
});

const updateStaff = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id,req.body.data)
  const data = JSON.parse(req.body.data);
  const file = req.file;

  const result = await staffService.updateStaff(id, data, file as Express.Multer.File);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Staff updated successfully",
    data: result,
  });
});
const deleteStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await staffService.deleteStaff(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Staff deleted successfully",
    data: result,
  });
});

export const staffController = {
  createStaff,
  getAllStaff,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};
