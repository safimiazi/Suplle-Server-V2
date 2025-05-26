
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { QRCodePurchaseController } from "./QRCodePurchase.controller";
    import { QRCodePurchasePostValidation,QRCodePurchaseUpdateValidation } from "./QRCodePurchase.validation";

    const router = express.Router();
    
    router.post("/post-QRCodePurchase", validateRequest(QRCodePurchasePostValidation), QRCodePurchaseController.postQRCodePurchase);
    router.get("/get-all-QRCodePurchase", QRCodePurchaseController.getAllQRCodePurchase);
    router.get("/get-single-QRCodePurchase/:id", QRCodePurchaseController.getSingleQRCodePurchase);
    router.put("/update-QRCodePurchase/:id", validateRequest(QRCodePurchaseUpdateValidation), QRCodePurchaseController.updateQRCodePurchase);
    router.delete("/delete-QRCodePurchase/:id", QRCodePurchaseController.deleteQRCodePurchase);
    
    export const QRCodePurchaseRoutes = router;