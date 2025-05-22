import status from "http-status";
import AppError from "../../errors/AppError";
import { MenuModel } from "./menu.model";
import { validateData } from "../../middlewares/validateData ";
import { IMenu } from "./menu.interface";
import { menuPostValidation } from "./menu.validation";
import { uploadImgToCloudinary } from "../../utils/sendImageToCloudinary";
import { RestaurantModel } from "../restuarant/restuarant.model";
import mongoose, { Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { MENU_SEARCHABLE_FIELDS } from "./menu.constant";

export const menuService = {
  async postMenuIntoDB(
    data: any,
    file: Express.Multer.File & { path?: string }
  ) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();


      const menudata = JSON.parse(data);



      if (file && file.path) {
        const imageName = `${Math.floor(100 + Math.random() * 900)}`;
        const { secure_url } = (await uploadImgToCloudinary(
          imageName,
          file.path
        )) as {
          secure_url: string;
        };
        menudata.image = secure_url;
      } else {
        menudata.image = null;
      }

      const validatedData = await validateData<IMenu>(
        menuPostValidation,
        menudata
      );


      const restaurant = await RestaurantModel.findById(
        validatedData.restaurant
      ).session(session);
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
      const service_query = new QueryBuilder(MenuModel.find(), query)
        .search(MENU_SEARCHABLE_FIELDS)
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
      }).populate("category");
      const meta = await service_query.countTotal();
      return {
        result,
        meta,
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
      const result = await MenuModel.findOne({ _id: id });
      if (!result) {
        throw new AppError(400, "Menu does not exist");
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

  async updateMenuIntoDB(
    data: any,
    file: Express.Multer.File & { path?: string },
    id: string
  ) {
    try {
      const existingMenu = await MenuModel.findById(id);
      if (!existingMenu) {
        throw new AppError(status.NOT_FOUND, "Menu not found");
      }

      if (existingMenu.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "Menu is already deleted");
      }

      let newData = data;
      if (file) {
        const imageName = `${Math.floor(100 + Math.random() * 900)}`;
        const path = file.path;
        const { secure_url } = (await uploadImgToCloudinary(
          imageName,
          path
        )) as {
          secure_url: string;
        };

        newData.image = secure_url as string;
      }

      const restaurant = await RestaurantModel.findOne({
        _id: newData.restaurant,
      });

      if (!restaurant) {
        throw new AppError(400, "restaurant doesn't found");
      }

      const result = await MenuModel.findByIdAndUpdate({ _id: id }, newData, {
        new: true,
      });
      return result;
    } catch (error: unknown) {
      throw error;
    }
  },


  async deleteMenuFromDB(id: string) {
    try {
      const isExist = await MenuModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "Menu not found");
      }

      if (isExist.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "Menu already deleted!");
      }

      await MenuModel.updateOne({ _id: id }, { isDeleted: true });

      return {
        success: true,
        message: "Menu deleted successfully!",
      };
    } catch (error: unknown) {
      throw error;
    }
  }

};
