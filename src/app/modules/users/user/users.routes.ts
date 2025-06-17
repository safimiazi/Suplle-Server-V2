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
  authenticate(ROLE.RESTAURANT_OWNER, ROLE.ADMIN),
  validateRequest(userInputSchema),
  userController.createUser
);

router.get("/all-users", authenticate(ROLE.RESTAURANT_OWNER, ROLE.ADMIN), userController.getAllUsers);
router.get("/all-users-owner", authenticate(ROLE.RESTAURANT_OWNER, ROLE.ADMIN), userController.getAllUsersOWner);

router.get("/single-user/:id", authenticate(ROLE.RESTAURANT_OWNER, ROLE.ADMIN), userController.getSingleUser);

router.put(
  "/update-user/:id", upload.single('image'), authenticate(ROLE.RESTAURANT_OWNER, ROLE.ADMIN, ROLE.STAFF),
  validateRequest(usersUpdateValidation),
  userController.updateUser
);

router.delete("/delete-user/:id", authenticate(ROLE.RESTAURANT_OWNER, ROLE.ADMIN), userController.deleteUser);

export const usersRoutes = router;
