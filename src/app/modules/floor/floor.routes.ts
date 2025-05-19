
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { floorController } from "./floor.controller";
    import { floorPostValidation,floorUpdateValidation } from "./floor.validation";

    const router = express.Router();
    
    router.post("/create-floor", validateRequest(floorPostValidation), floorController.postFloor);
    router.get("/all-floor", floorController.getAllFloor);
    router.get("/single-floor/:id", floorController.getSingleFloor);
    router.put("/update-floor/:id", validateRequest(floorUpdateValidation), floorController.updateFloor);
    router.delete("/delete-floor/:id", floorController.deleteFloor);
    
    export const floorRoutes = router;