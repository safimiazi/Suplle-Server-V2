import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { ownerController } from "./owner.controller";
import { ownerPostValidation, ownerUpdateValidation } from "./owner.validation";

const router = express.Router();

router.post(
  "/post_owner",
  validateRequest(ownerPostValidation),
  ownerController.postOwner
);
router.get("/get_all_owner", ownerController.getAllOwner);
router.get("/get_single_owner/:id", ownerController.getSingleOwner);
router.put(
  "/update_owner/:id",
  validateRequest(ownerUpdateValidation),
  ownerController.updateOwner
);
router.delete("/delete_owner/:id", ownerController.deleteOwner);

export const ownerRoutes = router;
