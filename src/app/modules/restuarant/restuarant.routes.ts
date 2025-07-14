import express from "express";
import { upload } from "../../utils/sendImageToCloudinary";
import { restuarantController } from "./restaurant.controller";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";
import { checkActiveSubscription } from "../../middlewares/checkSubscription";
import { validateRequest } from "../../middlewares/validateRequest";
import { restuarantPostValidation } from "./restuarant.validation";

const router = express.Router();

router.post(
  "/create-restaurant",
  authenticate(ROLE.RESTAURANT_OWNER),
  checkActiveSubscription(),
  // upload.fields([
  //   { name: "images", maxCount: 5 },
  //   { name: "logo", maxCount: 1 },
  // ]),
  validateRequest(restuarantPostValidation),
  restuarantController.postRestuarant
);

router.put(
  "/update-restaurant",
  authenticate(ROLE.RESTAURANT_OWNER, ROLE.ADMIN),

  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "logo", maxCount: 1 },
  ]),
  restuarantController.updateRestuarant
);

router.put(
  "/update-restaurant-admin/:id",
  authenticate(ROLE.ADMIN),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "logo", maxCount: 1 },
  ]),
  restuarantController.updateRestuarantByAdmin
);

router.get("/all-restaurant", authenticate(ROLE.ADMIN), restuarantController.getAllRestuarant);
router.get("/single-restaurant/:id", restuarantController.getSingleRestuarant);
// router.put("/update-restaurant/:id", validateRequest(restuarantUpdateValidation), restuarantController.updateRestuarant);
router.delete(
  "/delete-restaurant/:id",
  authenticate(ROLE.RESTAURANT_OWNER),
  restuarantController.deleteRestuarant
);
router.put("/account-settings", authenticate(ROLE.RESTAURANT_OWNER), restuarantController.setAccountSettings);


export const restuarantRoutes = router;
