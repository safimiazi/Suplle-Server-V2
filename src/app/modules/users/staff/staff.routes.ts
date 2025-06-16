import express, { NextFunction, Request, Response } from "express";
import { staffController } from "./staff.controller";
import { upload } from "../../../utils/sendImageToCloudinary";
import { authenticate } from "../../../middlewares/authGuard";
import { ROLE } from "../user/users.constant";

const router = express.Router();

router.post(
  "/create-staff",
  authenticate(ROLE.RESTAURANT_OWNER),
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    next();
  },
  staffController.createStaff
);
router.get("/all-staff", authenticate(ROLE.RESTAURANT_OWNER, ROLE.ADMIN),
  staffController.getAllStaff);
router.get("/single-staff/:id", staffController.getSingleStaff);
router.put(
  "/update-staff/:id", upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    next();
  }, authenticate(ROLE.RESTAURANT_OWNER, ROLE.ADMIN),
  staffController.updateStaff
);

router.delete("/delete-staff/:id", staffController.deleteStaff);

export const staffRoutes = router;
