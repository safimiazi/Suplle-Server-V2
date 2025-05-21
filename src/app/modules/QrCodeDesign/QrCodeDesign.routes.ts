import express from "express";
import { QrCodeDesignController } from "./QrCodeDesign.controller";

import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/post-QrCodeDesign",
  upload.single("image"),
  QrCodeDesignController.postQrCodeDesign
);
router.get("/get-all-QrCodeDesign", QrCodeDesignController.getAllQrCodeDesign);
router.get(
  "/get-single-QrCodeDesign/:id",
  QrCodeDesignController.getSingleQrCodeDesign
);
router.put(
  "/update-QrCodeDesign/:id",
  upload.single("image"),

  QrCodeDesignController.updateQrCodeDesign
);
router.delete(
  "/delete-QrCodeDesign/:id",
  QrCodeDesignController.deleteQrCodeDesign
);

export const QrCodeDesignRoutes = router;
