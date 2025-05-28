
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { floorController } from "./floor.controller";
    import { floorPostValidation,floorUpdateValidation } from "./floor.validation";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";

    const router = express.Router();
    
    router.post("/create-floor", authenticate(ROLE.RESTAURANT_OWNER), floorController.postFloor);
    router.get("/all-floor",authenticate(ROLE.RESTAURANT_OWNER), floorController.getAllFloor);
    router.get("/single-floor/:id",authenticate(ROLE.RESTAURANT_OWNER), floorController.getSingleFloor);
    router.put("/update-floor/:id",authenticate(ROLE.RESTAURANT_OWNER),  floorController.updateFloor);
    router.delete("/delete-floor/:id",authenticate(ROLE.RESTAURANT_OWNER), floorController.deleteFloor);
    
    export const floorRoutes = router;