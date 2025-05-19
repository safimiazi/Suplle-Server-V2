import status from "http-status";
import AppError from "../../errors/AppError";
import { CategoryModel } from "./category.model";
import { ICategory } from "./category.interface";

import { validateData } from "../../middlewares/validateData ";
import { categoryPostValidation } from "./category.validation";
import { RestaurantModel } from "../restuarant/restuarant.model";
import { uploadImgToCloudinary } from "../../utils/sendImageToCloudinary";

export const categoryService = {
  async postCategoryIntoDB(
    data: any,
    file: Express.Multer.File & { path?: string }
  ) {
    try {
      const categorydata = JSON.parse(data);

           const validatedData =  await validateData<ICategory>(categoryPostValidation, categorydata);
       
         
        if (file) {
          const imageName = `${Math.floor(100 + Math.random() * 900)}`;
          const path = file.path;
          const { secure_url } = (await uploadImgToCloudinary(imageName, path)) as {
            secure_url: string;
          };
    
          validatedData.image = secure_url as string;
        } else {
          validatedData.image = 'no image';
        }
      
        const restaurant = await  RestaurantModel.findOne({_id: validatedData.restaurant});
 
        if(!restaurant){
          throw new AppError(400,"restaurant doesn't found");
        }

        
        
        return await CategoryModel.create(validatedData);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new  AppError(400,"Category Can not be created");
          }
        }
      },
      async getAllCategoryFromDB(query: any) {
      try {
    
          const result= await CategoryModel.find({});
       return result;
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("Categories can not found");
          }
        }
      },
      async getSingleCategoryFromDB(id: string) {
        try {
        return await CategoryModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("Category can not retrieved");
          }
        }
      },
      async updateCategoryIntoDB(id:string,data:ICategory) {
      try {
      const isDeleted = await CategoryModel.findOne({ _id: id });

      if (!isDeleted) {
        throw new AppError(404, "category not found");
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
