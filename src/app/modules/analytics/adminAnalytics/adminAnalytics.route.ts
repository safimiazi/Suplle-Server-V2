
    import express from "express";
import { adminAnalyticController } from "./adminAnalytics.controller";

  
    const router = express.Router();
    
    router.get('/all-admin-analytics',adminAnalyticController.AdminAnalytics)
   
    export const AdminAnalyticsRoutes = router;