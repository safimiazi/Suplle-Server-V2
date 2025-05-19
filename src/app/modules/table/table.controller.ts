import { Request, Response } from "express";
    import { tableService } from "./table.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postTable = catchAsync(async (req: Request, res: Response) => {
      const result = await tableService.postTableIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Table Created successfully", data: result });
    });
    
    const getAllTable = catchAsync(async (req: Request, res: Response) => {
      const result = await tableService.getAllTableFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "All table Fetched successfully", data: result });
    });
    
    const getSingleTable = catchAsync(async (req: Request, res: Response) => {
      const result = await tableService.getSingleTableFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Single table Fetched successfully", data: result });
    });
    
    const updateTable = catchAsync(async (req: Request, res: Response) => {
      const id = req.params.id;
      const data = req.body
      const result = await tableService.updateTableIntoDB(id,data );
      sendResponse(res, { statusCode: status.OK, success: true, message: "Table Updated successfully", data: result });
    });
    
    const deleteTable = catchAsync(async (req: Request, res: Response) => {
      await tableService.deleteTableFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Table Deleted successfully",data: null });
    });

    
    export const tableController = { postTable, getAllTable, getSingleTable, updateTable, deleteTable };
    