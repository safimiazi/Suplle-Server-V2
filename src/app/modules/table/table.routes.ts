
    import express from "express";
    import { tableController } from "./table.controller";
import { authenticate } from "../../middlewares/authGuard";
import { ROLE } from "../users/user/users.constant";
import { checkActiveSubscription } from "../../middlewares/checkSubscription";

    const router = express.Router();
    
    router.post("/create-table-with-qrcode", authenticate(ROLE.RESTAURANT_OWNER), checkActiveSubscription("maxTables"), tableController.postTable);
    router.get("/get-all-table/:floorId", tableController.getAllTable);
    router.get("/get-single-table/:tableId", tableController.getSingleTable);
    router.put("/update_table/:id", tableController.updateTable);
    router.delete("/delete-table/:id", tableController.deleteTable);
    
    export const tableRoutes = router;