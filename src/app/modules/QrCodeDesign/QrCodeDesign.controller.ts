import { Request, Response } from "express";
import { QrCodeDesignService } from "./QrCodeDesign.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const postQrCodeDesign = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const data = req.body.data;


  const result = await QrCodeDesignService.postQrCodeDesignIntoDB(data, file);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

const getAllQrCodeDesign = catchAsync(async (req: Request, res: Response) => {
  const result = await QrCodeDesignService.getAllQrCodeDesignFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getSingleQrCodeDesign = catchAsync(
  async (req: Request, res: Response) => {
    const result = await QrCodeDesignService.getSingleQrCodeDesignFromDB(
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

const updateQrCodeDesign = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file;

  const data = JSON.parse(req.body.data);

  const result = await QrCodeDesignService.updateQrCodeDesignIntoDB(
    { ...data, id },
    file
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteQrCodeDesign = catchAsync(async (req: Request, res: Response) => {
  await QrCodeDesignService.deleteQrCodeDesignFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

export const QrCodeDesignController = {
  postQrCodeDesign,
  getAllQrCodeDesign,
  getSingleQrCodeDesign,
  updateQrCodeDesign,
  deleteQrCodeDesign,
};
