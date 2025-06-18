
import { OWNER_SEARCHABLE_FIELDS } from "./owner.constant";
import QueryBuilder from "../../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../../errors/AppError";
import { OwnerModel } from "./owner.model";
import { RestaurantModel } from "../../restuarant/restuarant.model";
import mongoose from "mongoose";

export const ownerService = {
  async postOwnerIntoDB(data: any) {
    try {
      return await OwnerModel.create(data);
    } catch (error: unknown) {
      throw error;


    }
  },
  async getAllOwnerFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(OwnerModel.find(), query)
        .search(OWNER_SEARCHABLE_FIELDS)
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
  async getSingleOwnerFromDB(id: string) {
    try {
      return await OwnerModel.findById(id);
    } catch (error: unknown) {
      throw error;


    }
  },
  async updateOwnerIntoDB(data: any, id: string) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const findOwner = await OwnerModel.findOne({ user: id }).session(session);
      if (!findOwner) {
        throw new AppError(400, "The owner (user) was not found");
      }

      // Update the related Restaurant's address
      const restaurantUpdate = await RestaurantModel.updateOne(
        { owner: findOwner._id },
        { restaurantAddress: data.restaurantAddress },
        { session }
      );

      if (restaurantUpdate.matchedCount === 0) {
        throw new AppError(404, "Associated restaurant not found");
      }

      // Update the Owner
      const ownerUpdate = await OwnerModel.updateOne(
        { user: id },
        data,
        { session }
      );

      if (ownerUpdate.matchedCount === 0) {
        throw new AppError(404, "Owner update failed");
      }

      await session.commitTransaction();
      return { ownerUpdate, restaurantUpdate };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
  async deleteOwnerFromDB(id: string) {
    try {
      // Step 1: Check if the owner exists in the database
      const isExist = await OwnerModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "owner not found");
      }

      // Step 4: Delete the home owner from the database
      await OwnerModel.updateOne({ _id: id }, { isDelete: true });
      return;
    } catch (error: unknown) {
      throw error;


    }
  },
};
