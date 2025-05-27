import status from "http-status";
import AppError from "../../errors/AppError";
import { FloorModel } from "./floor.model";
import { IFloor } from "./floor.interface";
import { RestaurantModel } from "../restuarant/restuarant.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { FLOOR_SEARCHABLE_FIELDS } from "./floor.constant";

export const floorService = {
  async postFloorIntoDB(data: any) {
    try {
      const restaurant = await RestaurantModel.findOne({
        _id: data.restaurant,
      });

      if (!restaurant) {
        throw new AppError(400, "restaurant doesn't found");
      }

      const floor = new FloorModel(data);
      return await floor.save();
    } catch (error: any) {
      throw error;

    }
  },
  async getAllFloorFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(FloorModel.find(), query)
        .search(FLOOR_SEARCHABLE_FIELDS)
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
      })
      const meta = await service_query.countTotal();
      return {
        result,
        meta,
      };
    } catch (error: unknown) {
      throw error;


    }
  },
async getSingleFloorFromDB(id: string) {
  try {
    const floor = await FloorModel.findOne({
      _id: id,
      isDeleted: false, 
    });

    if (!floor) {
      throw new Error("Floor not found or has been deleted");
    }

    return floor;
  } catch (error) {
    throw error;
  }
}
,
  async updateFloorIntoDB(data: IFloor, id: string) {
    try {
      const isDeleted = await FloorModel.findOne({ _id: id });
      if (isDeleted?.isDeleted) {
        throw new AppError(status.NOT_FOUND, "floor is already deleted");
      }

      const result = await FloorModel.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("floor not found.");
      }
      return result;
    } catch (error: unknown) {
      throw error;


    }
  },
  async deleteFloorFromDB(id: string) {
    try {
      const isExist = await FloorModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "floor not found");
      }
      await FloorModel.findByIdAndUpdate({_id: id},{ isDeleted:true });
      return;
    } catch (error: unknown) {
      throw error;


    }
  },
};
