import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { restaurantLayoutController } from "./restaurantLayout.controller";
import {
  restaurantLayoutPostValidation,
  restaurantLayoutUpdateValidation,
} from "./restaurantLayout.validation";

const router = express.Router();

router.post(
  "/create-restaurant-layout",
  validateRequest(restaurantLayoutPostValidation),
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
