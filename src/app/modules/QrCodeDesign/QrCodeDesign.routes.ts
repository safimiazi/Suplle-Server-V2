
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { QrCodeDesignController } from "./QrCodeDesign.controller";
    import { QrCodeDesignPostValidation,QrCodeDesignUpdateValidation } from "./QrCodeDesign.validation";

    const router = express.Router();
    
    router.post("/post_QrCodeDesign", validateRequest(QrCodeDesignPostValidation), QrCodeDesignController.postQrCodeDesign);
    router.get("/get_all_QrCodeDesign", QrCodeDesignController.getAllQrCodeDesign);
    router.get("/get_single_QrCodeDesign/:id", QrCodeDesignController.getSingleQrCodeDesign);
    router.put("/update_QrCodeDesign/:id", validateRequest(QrCodeDesignUpdateValidation), QrCodeDesignController.updateQrCodeDesign);
    router.delete("/delete_QrCodeDesign/:id", QrCodeDesignController.deleteQrCodeDesign);
    
    export const QrCodeDesignRoutes = router;