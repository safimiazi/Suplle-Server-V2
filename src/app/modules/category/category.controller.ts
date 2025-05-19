import { Request, Response } from "express";
    import { categoryService } from "./category.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
import { ICategory } from "./category.interface";
    
   const postCategory = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const data = req.body.data;

  

  const result = await categoryService.postCategoryIntoDB(data as ICategory, file as Express.Multer.File);
  
  sendResponse(res, {

    statusCode: status.CREATED,
    success: true,
    message: "Category Created successfully",
    data: result,
  });
});

    
    const getAllCategory = catchAsync(async (req: Request, res: Response) => {
      const result = await categoryService.getAllCategoryFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Categories Fetched successfully", data: result });
    });
    
    const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
      const result = await categoryService.getSingleCategoryFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Single category Fetched successfully", data: result });
    });
    
    const updateCategory = catchAsync(async (req: Request, res: Response) => {
   
      const updateData = req.body;
      const id = req.params.id
    
      const result = await categoryService.updateCategoryIntoDB(id, updateData);
    
      sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
      });
    });
    const deleteCategory = catchAsync(async (req: Request, res: Response) => {
     const data = await categoryService.deleteCategoryFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Category Deleted successfully",data: data });
    });

    
    export const categoryController = { postCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory };
    