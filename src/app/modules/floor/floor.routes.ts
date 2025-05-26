
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { floorController } from "./floor.controller";
    import { floorPostValidation,floorUpdateValidation } from "./floor.validation";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";

    const router = express.Router();
    
    router.post("/create-floor", authenticate(ROLE.RESTAURANT_OWNER), floorController.postFloor);
    router.get("/all-floor", floorController.getAllFloor);
    router.get("/single-floor/:id", floorController.getSingleFloor);
    router.put("/update-floor/:id",  floorController.updateFloor);
    router.delete("/delete-floor/:id", floorController.deleteFloor);
    
    export const floorRoutes = router;