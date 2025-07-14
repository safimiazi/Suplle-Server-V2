
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
  async getSingleOwnerFromDB(id: string, restaurant: string) {
    try {
      const result = await OwnerModel.findById(id);
      const restaurantdata = await RestaurantModel.findOne({ _id: restaurant });

      return { result, address: restaurantdata ? restaurantdata.restaurantAddress : null };
    } catch (error: unknown) {
      throw error;


    }
  },
  async updateOwnerIntoDB(data: any, id: string) {
    try {

      const finduser = await OwnerModel.findOne({ user: id });
      if (!finduser) {
        throw new AppError(404, "the user is not found");

      }

      if (data.businessEmail) {
        throw new AppError(400, "you cannot update bussiness email");
      }

      // const findRestaurant = await RestaurantModel.updateOne({ owner: finduser._id }, { restaurantAddress: data.restaurantAddress });


      const result = await OwnerModel.findOneAndUpdate({ user: id }, { ...data, address: data.restaurantAddress }, {
        new: true,
      });
      if (!result) {
        throw new Error("owner not found.");
      }
      return result;
    } catch (error: unknown) {
      throw error;


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
