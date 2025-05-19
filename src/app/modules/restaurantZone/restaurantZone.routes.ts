
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { restaurantZoneTypeController } from "./restaurantZone.controller";
    import { restaurantZoneValidationSchema, restaurantZoneUpdateValidation } from "./restaurantZone.validation";

    const router = express.Router();
    
    router.post("/create-zone", validateRequest(restaurantZoneValidationSchema), restaurantZoneTypeController.postRestaurantZoneType);
    router.get("/all-zone", restaurantZoneTypeController.getAllRestaurantZoneType);
    router.get("/single-zone", restaurantZoneTypeController.getSingleRestaurantZoneType);
    router.put("/update-zone/:id", validateRequest(restaurantZoneUpdateValidation), restaurantZoneTypeController.updateRestaurantZoneType);
    router.delete("/delete-zone/:id", restaurantZoneTypeController.deleteRestaurantZoneType);
    
    export const restaurantZoneRoutes = router;