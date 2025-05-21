import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest";

import { userInputSchema, usersUpdateValidation } from "./users.validation";
import { userController } from "./users.controller";
import { upload } from "../../../utils/sendImageToCloudinary";
import { authenticate } from "../../../middlewares/authGuard";
import { ROLE } from "./users.constant";

const router = express.Router();

router.post(
  "/owner-create-sub-user",
  authenticate(ROLE.RESTAURANT_OWNER),
  validateRequest(userInputSchema),
  userController.createUser
);

router.get("/all-users", userController.getAllUsers);

router.get("/single-user/:id", userController.getSingleUser);

router.put(
  "/update-user/:id",upload.single('image'),
  validateRequest(usersUpdateValidation),
  userController.updateUser
);

router.delete("/delete-user/:id", userController.deleteUser);

export const usersRoutes = router;
