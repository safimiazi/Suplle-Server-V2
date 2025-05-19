
    import status from "http-status";
    import AppError from "../../errors/AppError";
    import { MenuModel } from "./menu.model";
    import { validateData } from "../../middlewares/validateData ";
    import { IMenu } from "./menu.interface";
    import { menuPostValidation } from "./menu.validation";
    import { uploadImgToCloudinary } from "../../utils/sendImageToCloudinary";
    import { RestaurantModel } from "../restuarant/restuarant.model";
    import mongoose, { Types } from "mongoose";
    

    export const menuService = {
      async postMenuIntoDB(data: any, file: Express.Multer.File & { path?: string }) {
        const session = await mongoose.startSession();
      
        try {
          session.startTransaction();
      
          const menudata = JSON.parse(data);
      
          if (file && file.path) {
            const imageName = `${Math.floor(100 + Math.random() * 900)}`;
            const { secure_url } = await uploadImgToCloudinary(imageName, file.path) as {
              secure_url: string;
            };
            menudata.image = secure_url;
          } else {
            menudata.image = 'no image';
          }
      
        
          const validatedData = await validateData<IMenu>(menuPostValidation, menudata);
      
          const restaurant = await RestaurantModel.findById(validatedData.restaurant).session(session);
          if (!restaurant) {
            throw new AppError(400, "Restaurant doesn't exist");
          }
      
          const menu = await MenuModel.create([validatedData], { session });
          const createdMenu = menu[0];
      
  
          await RestaurantModel.findByIdAndUpdate(
            validatedData.restaurant,
            { $push: { menus: createdMenu._id } },
            { session }
          );
      
          await session.commitTransaction();
          session.endSession();
      
          return createdMenu;
      
        } catch (error: unknown) {
          // Rollback in case of any failure
          await session.abortTransaction();
          session.endSession();
      
          throw error;
        }
      },
      async getAllMenuFromDB(query: any) {
      try {
      const result  = await  MenuModel.find({})
          return {
            result
          };
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getSingleMenuFromDB(id: string) {
        try {
        return await MenuModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },

   
async getMenuWithRestaurantFromDB(id: string) {
  try {
    return await MenuModel.find({ restaurant: new Types.ObjectId(id) });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching by ID.");
    }
  }
},

  async updateMenuIntoDB(data:IMenu,id: string) {
      try {

      const isDeleted = await MenuModel.findOne({ _id:id});
        if (isDeleted?.isDeleted) {
          throw new AppError(status.NOT_FOUND, "menu is already deleted");
        }
    
        const result = await MenuModel.updateOne({ _id:id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("menu not found.");
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
      async deleteMenuFromDB(id: string) {
        try {
    
 
        const isExist = await MenuModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "menu not found");
        }
    
        await MenuModel.findByIdAndDelete({ _id: id });
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