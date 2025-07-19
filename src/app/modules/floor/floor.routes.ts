
import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { floorController } from "./floor.controller";
import { floorPostValidation, floorUpdateValidation } from "./floor.validation";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";
import { checkActiveSubscription } from "../../middlewares/checkSubscription";

const router = express.Router();

router.post("/create-floor",  authenticate(ROLE.RESTAURANT_OWNER), checkActiveSubscription("maxFloor"),floorController.postFloor);
router.get("/all-floor", authenticate(ROLE.ADMIN, ROLE.STAFF, ROLE.DINE_IN, ROLE.RESTAURANT_OWNER, ROLE.TAKEAWAY), floorController.getAllFloor);
router.get("/single-floor/:id", authenticate(ROLE.ADMIN, ROLE.STAFF, ROLE.DINE_IN, ROLE.RESTAURANT_OWNER, ROLE.TAKEAWAY), floorController.getSingleFloor);
router.put("/update-floor/:id", authenticate(ROLE.RESTAURANT_OWNER), floorController.updateFloor);
router.delete("/delete-floor/:id", authenticate(ROLE.RESTAURANT_OWNER), floorController.deleteFloor);

export const floorRoutes = router;