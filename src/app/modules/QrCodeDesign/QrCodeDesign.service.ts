import { QrCodeDesignModel } from "./QrCodeDesign.model";
import { QRCODEDESIGN_SEARCHABLE_FIELDS } from "./QrCodeDesign.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { uploadImgToCloudinary } from "../../utils/sendImageToCloudinary";
import {
  QrCodeDesignPostValidation,
  QrCodeDesignUpdateValidation,
} from "./QrCodeDesign.validation";
import { validateData } from "../../middlewares/validateData ";
import { IQrCodeDesign } from "./QrCodeDesign.interface";

export const QrCodeDesignService = {
  async postQrCodeDesignIntoDB(stringifiedData: any, file: any) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const data = JSON.parse(stringifiedData);

      // Check for duplicates
      const existingDesign = await QrCodeDesignModel.findOne({
        name: data.name,
        category: data.category,
        isDeleted: { $ne: true },
      });

      if (existingDesign) {
        throw new Error(
          "QR Code Design with this name and category already exists."
        );
      }

      // Handle image upload
      if (file && file.path) {
        const imageName = `qr-${Date.now()}-${Math.floor(
          100 + Math.random() * 900
        )}`;
        const { secure_url } = (await uploadImgToCloudinary(
          imageName,
          file.path
        )) as {
          secure_url: string;
        };
        data.image = secure_url;
      } 

      // Validate with Zod
      const validatedData = await validateData<IQrCodeDesign>(
        QrCodeDesignPostValidation,
        data
      );

      // Create the record
      const result = await QrCodeDesignModel.create([validatedData], {
        session,
      });

      await session.commitTransaction();
      return result[0];
    } catch (error: unknown) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
  async getAllQrCodeDesignFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(QrCodeDesignModel.find(), query)
        .search(QRCODEDESIGN_SEARCHABLE_FIELDS)
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
  async getSingleQrCodeDesignFromDB(id: string) {
    try {
      const design = await QrCodeDesignModel.findOne({
        _id: id,
        isDeleted: { $ne: true }, // Ensures it’s not marked as deleted
      });

      if (!design) {
        throw new Error("QR Code Design not found or has been deleted.");
      }

      return design;
    } catch (error: unknown) {
      throw error;
    }
  },
  async updateQrCodeDesignIntoDB(data: any, file: any) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // 1. Find existing document with session
      const existing = await QrCodeDesignModel.findById(data.id).session(
        session
      );
      if (!existing) {
        throw new AppError(status.NOT_FOUND, "QR Code Design not found.");
      }

      if (existing.isDeleted) {
        throw new AppError(
          status.BAD_REQUEST,
          "QR Code Design is already deleted."
        );
      }

      // 2. Handle image update
      if (file && file.path) {
        const imageName = `qr-${Date.now()}-${Math.floor(
          100 + Math.random() * 900
        )}`;
        const { secure_url } = (await uploadImgToCloudinary(
          imageName,
          file.path
        )) as {
          secure_url: string;
        };
        data.image = secure_url;
      } else {
        data.image = existing.image; // retain old image
      }

      // 3. Validate updated data
      const validatedData = await validateData<IQrCodeDesign>(
        QrCodeDesignUpdateValidation,
        data
      );

      // 4. Perform the update using session
      const updated = await QrCodeDesignModel.findByIdAndUpdate(
        data.id,
        validatedData,
        {
          new: true,
          session,
          runValidators: true,
        }
      );

      if (!updated) {
        throw new AppError(
          status.INTERNAL_SERVER_ERROR,
          "Failed to update QR Code Design."
        );
      }

      await session.commitTransaction();
      session.endSession();
      return updated;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },
  async deleteQrCodeDesignFromDB(id: string) {
    try {
      // Step 1: Check if the QrCodeDesign exists in the database
      const isExist = await QrCodeDesignModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "QrCodeDesign not found");
      }

      // Step 4: Delete the home QrCodeDesign from the database
      await QrCodeDesignModel.updateOne({ _id: id }, { isDeleted: true });
      return;
    } catch (error: unknown) {
               throw error;


    }
  },
};
