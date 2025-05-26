
    import express from "express";
import { adminAnalyticController } from "./adminAnalytics.controller";
import { authenticate } from "../../../middlewares/authGuard";
import { ROLE } from "../../users/user/users.constant";

  
    const router = express.Router();
    
    router.get('/all-admin-analytics',authenticate(ROLE.ADMIN) ,adminAnalyticController.AdminAnalytics)
   
    export const AdminAnalyticsRoutes = router;