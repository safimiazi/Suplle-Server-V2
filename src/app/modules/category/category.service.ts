import status from "http-status";
import AppError from "../../errors/AppError";
import { CategoryModel } from "./category.model";
import { ICategory } from "./category.interface";

import { validateData } from "../../middlewares/validateData ";
import { categoryPostValidation } from "./category.validation";
import { RestaurantModel } from "../restuarant/restuarant.model";
import { uploadImgToCloudinary } from "../../utils/sendImageToCloudinary";
import QueryBuilder from "../../builder/QueryBuilder";
import { CATEGORY_SEARCHABLE_FIELDS } from "./category.constant";

export const categoryService = {
  async postCategoryIntoDB(
    data: any,
    file: Express.Multer.File & { path?: string }
  ) {
    try {
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

      return await CategoryModel.create(newData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new AppError(400, "Category Can not be created");
      }
    }
  },
  async getAllCategoryFromDB(query: any, restaurantId: string) {
    try {
      const service_query = new QueryBuilder(
        CategoryModel.find({ restaurant: restaurantId }),
        query
      )
        .search(CATEGORY_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      const result = await service_query.modelQuery.populate({
        path: "restaurant",
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
  async getSingleCategoryFromDB(id: string) {
    try {
      const result = await CategoryModel.find({ _id: id });

      if (!result) {
        throw new AppError(404, "category donot found");
      }
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("Category can not retrieved");
      }
    }
  },
  async updateCategoryIntoDB(
    data: any,
    file: Express.Multer.File & { path?: string },
    id: string
  ) {
    try {
      const isDeleted = await CategoryModel.findOne({ _id: id });

      if (!isDeleted) {
        throw new AppError(404, "category not found");
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

      const result = await CategoryModel.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("Category can not be updated");
      }
    }
  },
  async deleteCategoryFromDB(id: string) {
    try {
      const isExist = await CategoryModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "category not found");
      }

      const data = await CategoryModel.findByIdAndDelete(
        { _id: id },
        { isDelete: true }
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("Category cannot be deleted");
      }
    }
  },
};
