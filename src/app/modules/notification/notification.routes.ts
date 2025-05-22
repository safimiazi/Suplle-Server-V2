
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { notificationController } from "./notification.controller";
    import { notificationPostValidation,notificationUpdateValidation } from "./notification.validation";

    const router = express.Router();
    
    router.post("/post_notification", validateRequest(notificationPostValidation), notificationController.postNotification);
    router.get("/get_all_notification", notificationController.getAllNotification);
    router.get("/get_single_notification/:id", notificationController.getSingleNotification);
    router.put("/update_notification/:id", validateRequest(notificationUpdateValidation), notificationController.updateNotification);
    router.delete("/delete_notification/:id", notificationController.deleteNotification);
    
    export const notificationRoutes = router;