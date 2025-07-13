
import express, { NextFunction, Request, Response } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { menuController } from "./menu.controller";
import { menuPostValidation, menuUpdateValidation } from "./menu.validation";
import { upload } from "../../utils/sendImageToCloudinary";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";

const router = express.Router();

router.post("/create-menu", upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    next();
  }, authenticate(ROLE.RESTAURANT_OWNER), menuController.postMenu);
router.get("/all-menu", authenticate(ROLE.ADMIN, ROLE.STAFF, ROLE.DINE_IN, ROLE.RESTAURANT_OWNER, ROLE.TAKEAWAY), menuController.getAllMenu);
router.get("/get-all-menu-by-restaurant", menuController.getAllMenuByRestaurantId)
router.get("/single-menu/:id", menuController.getSingleMenu);
router.get("/restaurant-menu/:restaurantId", menuController.MenuWithRestaurant);
router.put("/update-menu/:id", upload.fields([
  { name: "images", maxCount: 1 },
]), authenticate(ROLE.RESTAURANT_OWNER), validateRequest(menuUpdateValidation), menuController.updateMenu);
router.delete("/delete-menu/:id", menuController.deleteMenu);

export const menuRoutes = router;