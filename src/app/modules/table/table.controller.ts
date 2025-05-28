import { Request, Response } from "express";
import { tableService } from "./table.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const postTable = catchAsync(async (req: Request, res: Response) => {
  const user : any = req.user;

  const result = await tableService.postTableIntoDB({...req.body, restaurant: user.restaurant});
  sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
});

const getAllTable = catchAsync(async (req: Request, res: Response) => {
  const floorId = req.params.floorId as string;
  const result = await tableService.getAllTableFromDB(req.query, floorId);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
});

const getSingleTable = catchAsync(async (req: Request, res: Response) => {
  const result = await tableService.getSingleTableFromDB(req.params.tableId);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
});

const updateTable = catchAsync(async (req: Request, res: Response) => {
  const result = await tableService.updateTableIntoDB(req.body);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
});

const deleteTable = catchAsync(async (req: Request, res: Response) => {
  await tableService.deleteTableFromDB(req.params.id);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully", data: null });
});


export const tableController = { postTable, getAllTable, getSingleTable, updateTable, deleteTable };
