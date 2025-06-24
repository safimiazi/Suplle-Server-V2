import express, { NextFunction, Request, Response } from "express";
import { QrCodeDesignController } from "./QrCodeDesign.controller";

import { upload } from "../../utils/sendImageToCloudinary";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";

const router = express.Router();

router.post(
  "/post-QrCodeDesign",
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    next();
  }, authenticate(ROLE.ADMIN),
  QrCodeDesignController.postQrCodeDesign
);
router.get("/get-all-QrCodeDesign", authenticate(ROLE.ADMIN, ROLE.RESTAURANT_OWNER), QrCodeDesignController.getAllQrCodeDesign);
router.get(
  "/get-single-QrCodeDesign/:id", authenticate(ROLE.ADMIN),
  QrCodeDesignController.getSingleQrCodeDesign
);
router.put(
  "/update-QrCodeDesign/:id",
  upload.single("image"), authenticate(ROLE.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    next();
  },

  QrCodeDesignController.updateQrCodeDesign
);
router.delete(
  "/delete-QrCodeDesign/:id", authenticate(ROLE.ADMIN),
  QrCodeDesignController.deleteQrCodeDesign
);

export const QrCodeDesignRoutes = router;