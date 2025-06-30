import { Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { userService } from "./users.service";
import sendResponse from "../../../utils/sendResponse";
import { UserModel } from "./users.model";

const createUser = catchAsync(async (req: Request, res: Response) => {

  const user = req.user;

  const result = await userService.createUser(req.body, user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const result = await userService.getAllUsers(_req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});
const getAllUsersOWner = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const restaurant = await UserModel.findOne({ _id: user._id }).populate("selectedRestaurant");
  const result = await userService.getAllUsersForOwner(req.query, restaurant as unknown as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {

  const result = await userService.getSingleUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {


  const id = req.params.id;
  const file = req.file;
  const data = req.body.data;


  const result = await userService.updateUser(id, data, file as Express.Multer.File);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getAllUsersOWner
};
