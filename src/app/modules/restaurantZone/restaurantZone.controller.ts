import { Request, Response } from "express";
import { restaurantZoneTypeService } from "./restaurantZon.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const postRestaurantZoneType = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.user as any;

  const result = await restaurantZoneTypeService.postRestaurantZoneTypeIntoDB({ ...data, restaurant: user.selectedRestaurant });
  sendResponse(res, { statusCode: status.CREATED, success: true, message: "Restaurant zone Created successfully", data: result });
});

const getAllRestaurantZoneType = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await restaurantZoneTypeService.getAllRestaurantZoneTypeFromDB(req.query, user.selectedRestaurant);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Restaurant zone Fetched successfully", data: result });
});

const getSingleRestaurantZoneType = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantZoneTypeService.getSingleRestaurantZoneTypeFromDB(req.params.id);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Restaurant zone Fetched successfully", data: result });
});

const updateRestaurantZoneType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user as any;
  const result = await restaurantZoneTypeService.updateRestaurantZoneTypeIntoDB(req.body, id, user.selectedRestaurant);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Restaurant zone Updated successfully", data: result });
});

const deleteRestaurantZoneType = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  await restaurantZoneTypeService.deleteRestaurantZoneTypeFromDB(req.params.id, user.selectedRestaurant);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Restaurant zone Deleted successfully", data: null });
});


export const restaurantZoneTypeController = { postRestaurantZoneType, getAllRestaurantZoneType, getSingleRestaurantZoneType, updateRestaurantZoneType, deleteRestaurantZoneType };
