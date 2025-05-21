import express from "express";
import { upload } from "../../utils/sendImageToCloudinary";
import { restuarantController } from "./restaurant.controller";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";

const router = express.Router();

router.post(
  "/create-restaurant",
  authenticate(ROLE.RESTAURANT_OWNER),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "logo", maxCount: 1 },
  ]),
  restuarantController.postRestuarant
);

router.put(
  "/update-restaurant/:id",
  authenticate(ROLE.RESTAURANT_OWNER),

  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "logo", maxCount: 1 },
  ]),
  restuarantController.updateRestuarant
);

router.get("/all-restaurant", restuarantController.getAllRestuarant);
router.get("/single-restaurant/:id", restuarantController.getSingleRestuarant);
// router.put("/update-restaurant/:id", validateRequest(restuarantUpdateValidation), restuarantController.updateRestuarant);
router.delete(
  "/delete-restaurant/:id",
  authenticate(ROLE.RESTAURANT_OWNER),
  restuarantController.deleteRestuarant
);

export const restuarantRoutes = router;
