
import status from "http-status";
import AppError from "../../errors/AppError";
import { IRestaurantZone } from "./restaurantZone.interface";
import { RestaurantZone } from "./restaurantZone.model";
import { RestaurantModel } from "../restuarant/restuarant.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RESTAURANTZONETYPE_SEARCHABLE_FIELDS } from "./restaurantZone.constant";

export const restaurantZoneTypeService = {
  async postRestaurantZoneTypeIntoDB(data: IRestaurantZone) {


    const restaurant = await RestaurantModel.findById({ _id: data.restaurant })
    if (!restaurant) {
      throw new AppError(400, "the restaurant is not exists");
    }
    try {

      const result = await RestaurantZone.create(data);

      return result;

    } catch (error: unknown) {
      throw error;
    }
  },
  async getAllRestaurantZoneTypeFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(RestaurantZone.find(), query)
        .search(RESTAURANTZONETYPE_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      const result = await service_query.modelQuery.populate({
        path: "restaurant",
        populate: {
          path: "owner",
          populate: {
            path: "user",
            select: "name email phone role isDeleted",
          },
        },
      });
      const meta = await service_query.countTotal();
      return {
        result,
        meta,
      };
    } catch (error: unknown) {
      throw error;
    }
  },
  async getSingleRestaurantZoneTypeFromDB(id: string) {
    try {
      const result = await RestaurantZone.findById(id);
      if (!result) {
        throw new Error("Data not found!")
      }
      if (result.isDeleted) {
        throw new Error("Already Deleted")
      }
      return result;
    } catch (error: unknown) {
      throw error;
    }
  },
  async updateRestaurantZoneTypeIntoDB(data: Partial<IRestaurantZone>, id: string) {
    try {



      const isExist = await RestaurantZone.findOne({ _id: id });

      if (!isExist) {
        throw new Error("Data not found")
      }
      if (isExist?.isDeleted) {
        throw new AppError(status.NOT_FOUND, "restaurantZoneType is already deleted");
      }

      const result = await RestaurantZone.updateOne({ _id: id }, data, {
        new: true,
      });

      return result;


    } catch (error: unknown) {
      throw error
    }
  },
  async deleteRestaurantZoneTypeFromDB(id: string) {
    try {

      const isExist = await RestaurantZone.findOne({ _id: id });

      if (isExist?.isDeleted) {
        throw new AppError(status.NOT_FOUND, "restaurantZoneType already deleted");
      }

      const result = await RestaurantZone.updateOne({ _id: id }, { isDeleted: true });
      return result;

    } catch (error: unknown) {
      throw error;
    }
  },
};