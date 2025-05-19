
    import express from "express";
import { analyticController } from "./analytic.controller";
  
    const router = express.Router();
    
    router.get('/all-analytics/:id',analyticController.analytics)
   
    export const analyticsRoutes = router;