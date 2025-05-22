import { Request, Response } from "express";
    import { notificationService } from "./notification.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postNotification = catchAsync(async (req: Request, res: Response) => {
      const result = await notificationService.postNotificationIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllNotification = catchAsync(async (req: Request, res: Response) => {
      const result = await notificationService.getAllNotificationFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleNotification = catchAsync(async (req: Request, res: Response) => {
      const result = await notificationService.getSingleNotificationFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateNotification = catchAsync(async (req: Request, res: Response) => {
      const result = await notificationService.updateNotificationIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteNotification = catchAsync(async (req: Request, res: Response) => {
      await notificationService.deleteNotificationFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const notificationController = { postNotification, getAllNotification, getSingleNotification, updateNotification, deleteNotification };
    