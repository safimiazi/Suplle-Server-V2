import { Request, Response } from "express";
import { menuService } from "./menu.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { IMenu } from "./menu.interface";
import fs from "fs"
import * as XLSX from "xlsx"
import { CategoryModel } from "../category/category.model";
import { MenuModel } from "./menu.model";
import { RestaurantModel } from "../restuarant/restuarant.model";
import { UserModel } from "../users/user/users.model";

const postMenu = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const user: any = req.user;
  const data = req.body.data;
  const restaurantData = await UserModel.findOne({ _id: user._id });


  // return

  const restaurant = restaurantData?.selectedRestaurant;
  const result = await menuService.postMenuIntoDB(
    data, // still JSON string here
    restaurant as unknown as string, // restaurant ID (assumed to be in user object)
    file as Express.Multer.File
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Menu Created successfully",
    data: result,
  });
});

const uploadMenuFileController = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file?.path) {
    throw new Error("File not found");
  }

  try {
    const filePath = file.path;
    const fileBuffer = await fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Step 1: Prepare data (and check for any errors upfront)
    const modifiedData = await Promise.all(
      data.map(async (item: any) => {
        // Check restaurant
        const isExistRestaurant = await RestaurantModel.findOne({ restaurantName: item.restaurant });
        if (!isExistRestaurant) {
          throw new Error(`Restaurant "${item.restaurant}" was not found`);
        }

        // Check category
        let category = await CategoryModel.findOne({
          categoryName: item.category,
        });

        if (!category) {
          category = await CategoryModel.create({
            restaurant: isExistRestaurant._id,
            categoryName: item.category,
          });
        }

        return {
          ...item,
          restaurant: isExistRestaurant._id,
          category: category._id,
        };
      })
    );

    // Step 2: Insert all only if no error occurs
    const bulkInsertInDB = await MenuModel.insertMany(modifiedData);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Menu created successfully",
      data: bulkInsertInDB,
    });
  } catch (error) {
    // If anything fails, don't insert anything
    sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: `Menu upload failed: ${(error as Error).message}`,
      data: null,
    });
  }
});


const getAllMenu = catchAsync(async (req: Request, res: Response) => {

  const user: any = req.user;

  const restaurantData = await UserModel.findOne({ _id: user._id });


  // return

  const restaurant = restaurantData?.selectedRestaurant;
  const result = await menuService.getAllMenuFromDB(req.query, restaurant as unknown as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Menus Fetched successfully",
    data: result,
  });
});

const getSingleMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await menuService.getSingleMenuFromDB(id);
  console.log(result);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Single Menu Fetched successfully",
    data: result,
  });
});

const updateMenu = catchAsync(async (req: Request, res: Response) => {
  const data = req.body.data;
  const file = req.file;
  const parseData = JSON.parse(data);
  const user: any = req.user;
  const restaurantData = await UserModel.findOne({ _id: user._id });

  const restaurant = restaurantData?.selectedRestaurant;


  const id = req.params.id;
  const result = await menuService.updateMenuIntoDB(parseData, file as Express.Multer.File, id, restaurant as unknown as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Menu Updated successfully",
    data: result,
  });
});

const deleteMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await menuService.deleteMenuFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Menu Deleted successfully",
    data: result,
  });
});

const MenuWithRestaurant = catchAsync(async (req: Request, res: Response) => {
  const result = await menuService.getMenuWithRestaurantFromDB(
    req.params.restaurantId
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Restaurant menu fetched successfully",
    data: result,
  });
});

export const menuController = {
  postMenu,
  uploadMenuFileController,
  getAllMenu,
  getSingleMenu,
  updateMenu,
  deleteMenu,
  MenuWithRestaurant,
};
