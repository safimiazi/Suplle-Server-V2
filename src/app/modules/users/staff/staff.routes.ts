import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { staffController } from "./staff.controller";
import { staffPostValidation, staffUpdateValidation } from "./staff.validation";
import { upload } from "../../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/create-staff",
  upload.single("image"), 
  staffController.createStaff
);
router.get("/all-staff", staffController.getAllStaff);
router.get("/single-staff/:id", staffController.getSingleStaff);
router.put(
  "/update-staff/:id",upload.single('image'),
  staffController.updateStaff
);

router.delete("/delete-staff/:id", staffController.deleteStaff);

export const staffRoutes = router;
