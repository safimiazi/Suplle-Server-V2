import { QRCodePurchaseModel } from "./QRCodePurchase.model";
import { QRCODEPURCHASE_SEARCHABLE_FIELDS } from "./QRCodePurchase.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";
import { QrCodeDesignModel } from "../QrCodeDesign/QrCodeDesign.model";
import { generateQRCodeOrderId } from "./qrCodePurchase.utils";
import { notificationModel } from "../notification/notification.model";
import { io } from "../../../server";





export const QRCodePurchaseService = {
  async postQRCodePurchaseIntoDB(data: any) {
    try {
      const design: any = await QrCodeDesignModel.findById(data.qrCodeDesign);
      if (!design) {
        throw new AppError(status.NOT_FOUND, "QR code design not found");
      }
       const orderId =await generateQRCodeOrderId();

      const purchase = await QRCodePurchaseModel.create({
        user: data.user,
        restaurant: data.restaurant,
        qrCodeDesign: data.qrCodeDesign,
        tableQuantity: data.tableQuantity,
        status: "pending", 
        isPaid: false,
        price: design.price * data.tableQuantity,
        orderId
      });
      if (!purchase) {
        throw new AppError(status.BAD_REQUEST, "Failed to create QR code purchase");
      }
  
    // const notification = await notificationModel.create({
    //   type: "subscription", // or create a new type like "qr_code_purchase"
    //   message: `A QR code purchase was made for restaurant ${data.restaurant} with ${data.tableQuantity} tables.`,
    // });

    // if (io) {
    //   io.emit("new_notification", notification);
    // }

    return purchase;

    } catch (error: unknown) {
      throw error;
    }
  },
  async getAllQRCodePurchaseFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(QRCodePurchaseModel.find(), query)
        .search(QRCODEPURCHASE_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      const result = await service_query.modelQuery;
      const meta = await service_query.countTotal();
      return {
        result,
        meta,
      };

    } catch (error: unknown) {
      throw error;
    }
  },
  async getSingleQRCodePurchaseFromDB(id: string) {
    try {
      const qrcodeDesing = await QRCodePurchaseModel.findById(id);
      if (!qrcodeDesing) {
        throw new AppError(status.NOT_FOUND, "QRCodePurchase not found");
      }
      if (qrcodeDesing.isDeleted) {
        throw new AppError(status.NOT_FOUND, "QRCodePurchase is already deleted");
      }
      return qrcodeDesing;
    } catch (error: unknown) {
      throw error;
    }
  },
  async updateQRCodePurchaseIntoDB(data: any) {
    try {


      const isDeleted = await QRCodePurchaseModel.findOne({ _id: data.id });
      if (isDeleted?.isDeleted) {
        throw new AppError(status.NOT_FOUND, "QR Code Purchase is already deleted");
      }

      const result = await QRCodePurchaseModel.updateOne({ _id: data.id }, { status: data.status }, {
        new: true,
      });
      if (!result) {
        throw new Error("QR Code Purchase not found.");
      }
      return result;


    } catch (error: unknown) {
      throw error;
    }
  },
  async deleteQRCodePurchaseFromDB(id: string) {
    try {

      // Step 1: Check if the QRCodePurchase exists in the database
      const isExist = await QRCodePurchaseModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "QRCodePurchase not found");
      }

      // Step 4: Delete the home QRCodePurchase from the database
      await QRCodePurchaseModel.updateOne({ _id: id }, { isDeleted: true });
      return;

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
};