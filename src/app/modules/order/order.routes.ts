import express from "express";
import { orderController } from "./order.controller";
import { validateRequest } from "../../middlewares/validateRequest";


import { orderPostValidation, orderUpdateValidation } from "./order.validation";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";




const router = express.Router();

router.post(
  "/create-order",
  authenticate(ROLE.DINE_IN, ROLE.RESTAURANT_OWNER, ROLE.TAKEAWAY),
  validateRequest(orderPostValidation),
  orderController.createOrder
);

router.get("/all-order", authenticate(ROLE.ADMIN, ROLE.STAFF, ROLE.DINE_IN, ROLE.RESTAURANT_OWNER, ROLE.TAKEAWAY), orderController.getAllOrders);

router.get("/single-order/:id", authenticate(ROLE.ADMIN, ROLE.STAFF, ROLE.DINE_IN, ROLE.RESTAURANT_OWNER, ROLE.TAKEAWAY), orderController.getSingleOrder);

router.put(
  "/update-order/:id",
  authenticate(ROLE.ADMIN, ROLE.STAFF, ROLE.ADMIN, ROLE.STAFF, ROLE.DINE_IN, ROLE.RESTAURANT_OWNER, ROLE.TAKEAWAY),
  validateRequest(orderUpdateValidation),

  orderController.updateOrder
);

router.delete("/delete-order/:id", authenticate(ROLE.ADMIN, ROLE.RESTAURANT_OWNER, ROLE.STAFF, ROLE.DINE_IN, ROLE.TAKEAWAY), orderController.deleteOrder);

export const orderRoutes = router;
