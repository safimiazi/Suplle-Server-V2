import express from "express";
import { orderController } from "./order.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  orderPostValidation,
  orderUpdateValidation,
} from "./order.validation";

const router = express.Router();

router.post(
  "/create-order",
  validateRequest(orderPostValidation),
  orderController.createOrder
);

router.get("/all-order", orderController.getAllOrders);

router.get("/single-order/:id", orderController.getSingleOrder);

router.put(
  "/update-order/:id",
  validateRequest(orderUpdateValidation),
  orderController.updateOrder
);

router.delete("/delete-order/:id", orderController.deleteOrder);

export const orderRoutes = router;
