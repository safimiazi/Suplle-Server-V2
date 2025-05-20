import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { QrCodeDesignController } from "./QrCodeDesign.controller";
import {
  QrCodeDesignPostValidation,
  QrCodeDesignUpdateValidation,
} from "./QrCodeDesign.validation";

const router = express.Router();

router.post(
  "/post-QrCodeDesign",
  validateRequest(QrCodeDesignPostValidation),
  QrCodeDesignController.postQrCodeDesign
);
router.get("/get-all-QrCodeDesign", QrCodeDesignController.getAllQrCodeDesign);
router.get(
  "/get-single-QrCodeDesign/:id",
  QrCodeDesignController.getSingleQrCodeDesign
);
router.put(
  "/update-QrCodeDesign/:id",
  validateRequest(QrCodeDesignUpdateValidation),
  QrCodeDesignController.updateQrCodeDesign
);
router.delete(
  "/delete-QrCodeDesign/:id",
  QrCodeDesignController.deleteQrCodeDesign
);

export const QrCodeDesignRoutes = router;
