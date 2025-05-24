
import express from "express";
import { subscriptionController } from "./subscription.controller";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";

const router = express.Router();

router.post("/create-subscription-intent", authenticate(ROLE.RESTAURANT_OWNER), subscriptionController.createSubscriptionIntent);
router.post("/activate-subscription", authenticate(ROLE.RESTAURANT_OWNER), subscriptionController.activateSubscription);


export const subscriptionRoutes = router;