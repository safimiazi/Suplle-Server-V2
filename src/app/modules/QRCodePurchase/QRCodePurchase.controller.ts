import { Request, Response } from "express";
import { QRCodePurchaseService } from "./QRCodePurchase.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { QRCodePurchaseModel } from "./QRCodePurchase.model";
import { stripe } from "../../utils/stripe";

const postQRCodePurchase = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const result = await QRCodePurchaseService.postQRCodePurchaseIntoDB({ ...req.body, user: user._id, restaurant: user.restaurant });
  sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
});


const qrCodePurchaseDecisionByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id, status } = req.body;

  const isExistingPurchase = await QRCodePurchaseModel.findOne({ _id: id, status: "pending" });
  if (!isExistingPurchase) {
    throw new Error("QR code purchase not found or not in pending state.");
  }


  const updatedPurchase = await QRCodePurchaseModel.findByIdAndUpdate(
    isExistingPurchase._id,
    { status },
    { new: true }
  );
  if (!updatedPurchase) {
    throw new Error("QR code purchase not found or already processed.");
  }

  sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: updatedPurchase });
});


const createQrCodePurchaseIntent = catchAsync(async (req: Request, res: Response) => {
  const qrCodeDesignPurchaseId = req.body.qrCodeDesignId;
  const user: any = req.user;

  const getProcesingDesign = await QRCodePurchaseModel.findOne({
    _id: qrCodeDesignPurchaseId,
    isDeleted: false,
    status: "approved",
  });

  if (!getProcesingDesign) {
    throw new Error("QR code design is not in approved state");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: getProcesingDesign.price * 100, // amount in cents
    currency: 'usd',
    metadata: {
      userId: user._id.toString(),
      restaurantId: getProcesingDesign.restaurant.toString(),
      qrCodePurchaseId: getProcesingDesign._id.toString(),
      // add anything you want for tracking
    },
    automatic_payment_methods: { enabled: true },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });

})

const qrCodePayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  // Retrieve the PaymentIntent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment not successful yet. Please try again.');
  }

  const { userId, restaurantId, qrCodePurchaseId } = paymentIntent.metadata;

  // Update the QR code purchase status to completed
  const updatedPurchase = await QRCodePurchaseModel.findByIdAndUpdate(
    qrCodePurchaseId,
    { isPaid: true },
    { new: true }
  );

  if (!updatedPurchase) {
    throw new Error('QR code purchase not found or already processed.');
  }

  sendResponse(res, { statusCode: status.OK, success: true, message: "Payment successful and QR code purchase updated", data: updatedPurchase });
})

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
  sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully", data: null });
});


export const QRCodePurchaseController = { postQRCodePurchase, qrCodePurchaseDecisionByAdmin, createQrCodePurchaseIntent, getAllQRCodePurchase, qrCodePayment, getSingleQRCodePurchase, updateQRCodePurchase, deleteQRCodePurchase };
