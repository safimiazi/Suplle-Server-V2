import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { SubscriptionPlanController } from "./SubscriptionPlan.controller";
import {
  SubscriptionPlanPostValidation,
  SubscriptionPlanUpdateValidation,
} from "./SubscriptionPlan.validation";

const router = express.Router();

router.post(
  "/create-subscriptionPlan",
  // validateRequest(SubscriptionPlanPostValidation),
  SubscriptionPlanController.postSubscriptionPlan
);
router.get(
  "/get-all-subscriptionPlan",
  SubscriptionPlanController.getAllSubscriptionPlan
);
router.get(
  "/get-single-subscriptionPlan/:id",
  SubscriptionPlanController.getSingleSubscriptionPlan
);
router.put(
  "/update-subscriptionPlan/:id",
  validateRequest(SubscriptionPlanUpdateValidation),
  SubscriptionPlanController.updateSubscriptionPlan
);
router.delete(
  "/delete-subscriptionPlan/:id",
  SubscriptionPlanController.deleteSubscriptionPlan
);

export const SubscriptionPlanRoutes = router;
