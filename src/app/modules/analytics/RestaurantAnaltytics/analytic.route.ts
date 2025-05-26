
    import express from "express";
import { analyticController } from "./analytic.controller";
import { authenticate } from "../../../middlewares/authGuard";
import { ROLE } from "../../users/user/users.constant";

  
    const router = express.Router();
    
    router.get('/all-analytics',authenticate(ROLE.RESTAURANT_OWNER), analyticController.analytics)
   
    export const analyticsRoutes = router;