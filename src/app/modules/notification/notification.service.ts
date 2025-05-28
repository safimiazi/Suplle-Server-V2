import { notificationModel } from "./notification.model";
import { NOTIFICATION_SEARCHABLE_FIELDS } from "./notification.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";





export const notificationService = {
  async postNotificationIntoDB(data: any) {
    try {
      return await notificationModel.create(data);
    } catch (error: unknown) {
      throw error;


    }
  },
  async getAllNotificationFromDB(query: any) {
    try {


      const service_query = new QueryBuilder(notificationModel.find(), query)
        .search(NOTIFICATION_SEARCHABLE_FIELDS)
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
  async getSingleNotificationFromDB(id: string) {
    try {
      return await notificationModel.findById(id);
    } catch (error: unknown) {
      throw error;


    }
  },
  async updateNotificationIntoDB(data: any) {
    try {



      const isDeleted = await notificationModel.findOne({ _id: data.id });
      if (isDeleted?.isDeleted) {
        throw new AppError(status.NOT_FOUND, "notification is already deleted");
      }

      const result = await notificationModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("notification not found.");
      }
      return result;


    } catch (error: unknown) {
      throw error;


    }
  },
  async deleteNotificationFromDB(id: string) {
    try {


      // Step 1: Check if the notification exists in the database
      const isExist = await notificationModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "notification not found");
      }

      // Step 4: Delete the home notification from the database
      await notificationModel.updateOne({ _id: id }, { isDelete: true });
      return;

    } catch (error: unknown) {
      throw error;


    }
  },
};