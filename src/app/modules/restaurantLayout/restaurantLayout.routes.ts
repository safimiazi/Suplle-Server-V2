import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { restaurantLayoutController } from "./restaurantLayout.controller";
import {
  restaurantLayoutPostValidation,
  restaurantLayoutUpdateValidation,
} from "./restaurantLayout.validation";

import { ROLE } from "../users/user/users.constant";
import { authenticate } from "../../middlewares/authGuard";

const router = express.Router();

router.post(
  "/create-restaurant-layout",  authenticate(ROLE.RESTAURANT_OWNER),
  // validateRequest(restaurantLayoutPostValidation),
  restaurantLayoutController.postRestaurantLayout
);

router.get("/all-restaurant-layout", restaurantLayoutController.getAllRestaurantLayout);

router.get("/single-restaurant-layout/:id", restaurantLayoutController.getSingleRestaurantLayout);

router.put(
  "/update-restaurant-layout/:id",
  validateRequest(restaurantLayoutUpdateValidation),
  restaurantLayoutController.updateRestaurantLayout
);


router.delete("/delete-restaurant-layout/:id", restaurantLayoutController.deleteRestaurantLayout);

export const restaurantLayoutRoutes = router;
