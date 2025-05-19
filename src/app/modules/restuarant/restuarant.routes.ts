
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";

    import { restuarantUpdateValidation } from "./restuarant.validation";
import { upload } from "../../utils/sendImageToCloudinary";
import { restuarantController } from "./restaurant.controller";

    const router = express.Router();
    
    router.post(
        "/create-restaurant",
        upload.fields([
          { name: "images", maxCount: 5 },
          { name: "logo", maxCount: 1 },
        ]),
        restuarantController.postRestuarant
      );
      
    
      router.put(
        "/update-restaurant/:id",
        upload.fields([
          { name: "images", maxCount: 5 },
          { name: "logo", maxCount: 1 },
        ]),
        restuarantController.updateRestuarant
      );
      
    router.get("/all-restaurant", restuarantController.getAllRestuarant);
    router.get("/single-restaurant/:id", restuarantController.getSingleRestuarant);
    // router.put("/update-restaurant/:id", validateRequest(restuarantUpdateValidation), restuarantController.updateRestuarant);
    router.delete("/delete-restaurant/:id", restuarantController.deleteRestuarant);
    
    export const restuarantRoutes = router;