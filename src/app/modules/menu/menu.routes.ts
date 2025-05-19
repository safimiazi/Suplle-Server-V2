
    import express, { NextFunction, Request, Response } from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { menuController } from "./menu.controller";
    import { menuPostValidation,menuUpdateValidation } from "./menu.validation";
import { upload } from "../../utils/sendImageToCloudinary";

    const router = express.Router();
    
    router.post("/create-menu",upload.single('image'),
    (req: Request, res: Response, next: NextFunction) => {
      next();
    }, menuController.postMenu);
    router.get("/all-menu", menuController.getAllMenu);
    router.get("/single-menu/:id", menuController.getSingleMenu);
    router.get("/restaurant-menu/:restaurantId", menuController.MenuWithRestaurant);
    router.put("/update-menu/:id", validateRequest(menuUpdateValidation), menuController.updateMenu);
    router.delete("/delete-menu/:id", menuController.deleteMenu);
    
    export const menuRoutes = router;