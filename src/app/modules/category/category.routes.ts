
    import express, { NextFunction, Request, Response } from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { categoryController } from "./category.controller";
    import { categoryPostValidation} from "./category.validation";
import { upload } from "../../utils/sendImageToCloudinary";

    const router = express.Router();

    
    
    router.post("/create-category",upload.single('image'),
    (req: Request, res: Response, next: NextFunction) => {
      next();
    }, categoryController.postCategory);
    router.get("/all-category", categoryController.getAllCategory);
    router.get("/single-category/:id", categoryController.getSingleCategory);
    router.put("/update-category/:id", categoryController.updateCategory);
    router.delete("/delete-category/:id", categoryController.deleteCategory);
    
    export const categoryRoutes = router;