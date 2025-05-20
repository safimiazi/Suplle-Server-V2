
import status from "http-status";
import AppError from "../../errors/AppError";
import { IRestaurantZone } from "./restaurantZone.interface";
import { RestaurantZone } from "./restaurantZone.model";
import { FloorModel } from "../floor/floor.model";
import { RestaurantModel } from "../restuarant/restuarant.model";
    
    export const restaurantZoneTypeService = {
      async postRestaurantZoneTypeIntoDB(data:IRestaurantZone) {
        const floor = await FloorModel.findById({_id:data.floor})
        if(!floor){
          throw new AppError(400,"the floor is not exists");
        }
        const  restaurant = await RestaurantModel.findById({_id:data.restaurant})
        if(!restaurant){
          throw new AppError(400,"the restaurant is not exists");
        }
      try {

        const result  =  await RestaurantZone.create(data);

        return result;
        
         } catch (error: unknown) {
          throw error;
        } 
      },
      async getAllRestaurantZoneTypeFromDB(query: any) {
      try {
    
    const result = await RestaurantZone.find({});
      return result
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getSingleRestaurantZoneTypeFromDB(id: string) {
        try {
        return await RestaurantZone.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async updateRestaurantZoneTypeIntoDB(data:Partial<IRestaurantZone>,id:string) {
      try {
    
    
    
      const isDeleted = await RestaurantZone.findOne({ _id: id });
        if (isDeleted?.isDeleted) {
          throw new AppError(status.NOT_FOUND, "restaurantZoneType is already deleted");
        }
    
        const result = await RestaurantZone.updateOne({ _id: id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("restaurantZoneType not found.");
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
      async deleteRestaurantZoneTypeFromDB(id: string) {
        try {
    
        const isExist = await RestaurantZone.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "restaurantZoneType not found");
        }
   
        const result =    await RestaurantZone.findByIdAndDelete({ _id: id });
        return result;
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
    };