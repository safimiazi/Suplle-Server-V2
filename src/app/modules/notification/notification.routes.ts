
import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { notificationController } from "./notification.controller";
import { notificationPostValidation, notificationUpdateValidation } from "./notification.validation";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";

const router = express.Router();

router.post("/post_notification", validateRequest(notificationPostValidation), notificationController.postNotification);
router.get("/get-all-notification", authenticate(ROLE.ADMIN, ROLE.RESTAURANT_OWNER), notificationController.getAllNotification);
router.get("/get_single_notification/:id", notificationController.getSingleNotification);
router.put("/update_notification/:id", validateRequest(notificationUpdateValidation), notificationController.updateNotification);
router.delete("/delete_notification/:id", notificationController.deleteNotification);

export const notificationRoutes = router;