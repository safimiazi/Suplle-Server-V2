import { Request, Response } from "express";
import { categoryService } from "./category.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { ICategory } from "./category.interface";
import { UserModel } from "../users/user/users.model";

const postCategory = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const data = req.body.data;
  // const { restaurant } = req.user as { restaurant: string };
  const user: any = req.user;
  const parsedData = JSON.parse(data);
  const restaurant = await UserModel.findOne({ _id: user._id }).populate("selectedRestaurant");

  const result = await categoryService.postCategoryIntoDB(
    { ...parsedData, restaurant } as ICategory,
    file as Express.Multer.File
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Category Created successfully",
    data: result,
  });
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;

  const restaurantId = UserModel.findOne({ _id: user._id }).populate("selectedRestaurant");
  const result = await categoryService.getAllCategoryFromDB(
    req.query,
    restaurantId as unknown as string
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Categories Fetched successfully",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getSingleCategoryFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Single category Fetched successfully",
    data: result,
  });
});
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const data = req.body.data;
  const user: any = req.user;

  const restaurant = await UserModel.findOne({ _id: user._id }).populate("selectedRestaurant");


  const parsedData = JSON.parse(data);
  const { id } = req.params;

  const result = await categoryService.updateCategoryIntoDB(
    { ...parsedData, restaurant: restaurant } as ICategory,
    file as Express.Multer.File,
    id
  );
  // const result = await categoryService.(id, updateData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const data = await categoryService.deleteCategoryFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category Deleted successfully",
    data: data,
  });
});

export const categoryController = {
  postCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
