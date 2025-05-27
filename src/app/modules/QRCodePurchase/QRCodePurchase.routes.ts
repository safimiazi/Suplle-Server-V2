
import express from "express";
import { QRCodePurchaseController } from "./QRCodePurchase.controller";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";

const router = express.Router();

router.post("/qr-code-purchase", authenticate(ROLE.RESTAURANT_OWNER), QRCodePurchaseController.postQRCodePurchase);
router.post("/qr-purchase-decision-by-admin", authenticate(ROLE.ADMIN), QRCodePurchaseController.qrCodePurchaseDecisionByAdmin);

router.post("/create-qr-code-intent", authenticate(ROLE.RESTAURANT_OWNER), QRCodePurchaseController.createQrCodePurchaseIntent);
router.post("/qr-code-payment", authenticate(ROLE.RESTAURANT_OWNER), QRCodePurchaseController.qrCodePayment);

router.get("/get-all-qr-purchase", QRCodePurchaseController.getAllQRCodePurchase);
router.get("/get-single-qr-purchase/:id", QRCodePurchaseController.getSingleQRCodePurchase);
router.put("/update-qr-purchase-by-admin/:id", QRCodePurchaseController.updateQRCodePurchase);
router.delete("/delete-qr-purchase/:id", QRCodePurchaseController.deleteQRCodePurchase);

export const QRCodePurchaseRoutes = router;