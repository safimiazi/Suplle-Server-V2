import status from "http-status";
import AppError from "../../errors/AppError";
import { FloorModel } from "./floor.model";
import { IFloor } from "./floor.interface";
import { RestaurantModel } from "../restuarant/restuarant.model";

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
      const result = await FloorModel.find({});
      return {
        result,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getSingleFloorFromDB(id: string) {
    try {
      return await FloorModel.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
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
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async deleteFloorFromDB(id: string) {
    try {
      const isExist = await FloorModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "floor not found");
      }
      await FloorModel.findByIdAndDelete({ _id: id });
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
