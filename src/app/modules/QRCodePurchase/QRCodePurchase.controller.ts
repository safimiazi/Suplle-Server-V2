import { Request, Response } from "express";
    import { QRCodePurchaseService } from "./QRCodePurchase.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postQRCodePurchase = catchAsync(async (req: Request, res: Response) => {
      const result = await QRCodePurchaseService.postQRCodePurchaseIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllQRCodePurchase = catchAsync(async (req: Request, res: Response) => {
      const result = await QRCodePurchaseService.getAllQRCodePurchaseFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleQRCodePurchase = catchAsync(async (req: Request, res: Response) => {
      const result = await QRCodePurchaseService.getSingleQRCodePurchaseFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateQRCodePurchase = catchAsync(async (req: Request, res: Response) => {
      const result = await QRCodePurchaseService.updateQRCodePurchaseIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteQRCodePurchase = catchAsync(async (req: Request, res: Response) => {
      await QRCodePurchaseService.deleteQRCodePurchaseFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const QRCodePurchaseController = { postQRCodePurchase, getAllQRCodePurchase, getSingleQRCodePurchase, updateQRCodePurchase, deleteQRCodePurchase };
    