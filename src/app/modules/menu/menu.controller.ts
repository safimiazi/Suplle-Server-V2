import { Request, Response } from "express";
    import { menuService } from "./menu.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
import { IMenu } from "./menu.interface";
    
    const postMenu = catchAsync(async (req: Request, res: Response) => {
      const file = req.file;
      const data = req.body.data;
      const result = await menuService.postMenuIntoDB(data as IMenu, file as Express.Multer.File);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Menu Created successfully", data: result });
    });
    
    const getAllMenu = catchAsync(async (req: Request, res: Response) => {
      const result = await menuService.getAllMenuFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Menus Fetched successfully", data: result });
    });
    
    const getSingleMenu = catchAsync(async (req: Request, res: Response) => {
      const result = await menuService.getSingleMenuFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Single Menu Fetched successfully", data: result });
    });
    
    const updateMenu = catchAsync(async (req: Request, res: Response) => {
      const data = req.body;
      const id = req.params.id;
      const result = await menuService.updateMenuIntoDB(data,id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Menu Updated successfully", data: result });
    });
    
    const deleteMenu = catchAsync(async (req: Request, res: Response) => {
    const result =  await menuService.deleteMenuFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Menu Deleted successfully",data: result });
    });

    const  MenuWithRestaurant = catchAsync(async (req: Request, res: Response) => {
     
     const result =  await menuService.getMenuWithRestaurantFromDB(req.params.restaurantId);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Restaurant menu fetched successfully",data: result});
    });


    
    export const menuController = { postMenu, getAllMenu, getSingleMenu, updateMenu, deleteMenu,MenuWithRestaurant };
    