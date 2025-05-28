import express from "express";
import { orderController } from "./order.controller";
import { validateRequest } from "../../middlewares/validateRequest";


import { ROLE } from "../../constant/role";
import { orderPostValidation, orderUpdateValidation } from "./order.validation";
import { authenticate } from "../../middlewares/authGuard";




const router = express.Router();

router.post(
  "/create-order",
authenticate(ROLE.STAFF),
validateRequest(orderPostValidation),
  orderController.createOrder
);

router.get("/all-order",authenticate(ROLE.ADMIN,ROLE.STAFF), orderController.getAllOrders);

router.get("/single-order/:id",authenticate(ROLE.ADMIN,ROLE.STAFF), orderController.getSingleOrder);

router.put(
  "/update-order/:id",
  authenticate(ROLE.ADMIN,ROLE.STAFF),
  validateRequest(orderUpdateValidation),
 
  orderController.updateOrder
);

router.delete("/delete-order/:id",authenticate(ROLE.STAFF), orderController.deleteOrder);

export const orderRoutes = router;
