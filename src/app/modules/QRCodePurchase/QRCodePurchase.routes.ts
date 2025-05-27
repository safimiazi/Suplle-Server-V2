
import express from "express";
import { QRCodePurchaseController } from "./QRCodePurchase.controller";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";

const router = express.Router();

router.post("/qr-code-purchase", authenticate(ROLE.RESTAURANT_OWNER), QRCodePurchaseController.postQRCodePurchase);
router.post("/qr-purchase-decision-by-admin", authenticate(ROLE.ADMIN), QRCodePurchaseController.qrCodePurchaseDecisionByAdmin);

router.post("/create-qr-code-intent", authenticate(ROLE.RESTAURANT_OWNER), QRCodePurchaseController.createQrCodePurchaseIntent);
router.post("/qr-code-payment", authenticate(ROLE.RESTAURANT_OWNER), QRCodePurchaseController.qrCodePayment);

router.get("/get-all-QRCodePurchase", QRCodePurchaseController.getAllQRCodePurchase);
router.get("/get-single-QRCodePurchase/:id", QRCodePurchaseController.getSingleQRCodePurchase);
router.put("/update-QRCodePurchase/:id", QRCodePurchaseController.updateQRCodePurchase);
router.delete("/delete-QRCodePurchase/:id", QRCodePurchaseController.deleteQRCodePurchase);

export const QRCodePurchaseRoutes = router;