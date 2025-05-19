
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { tableController } from "./table.controller";
    import { tablePostValidation,tableUpdateValidation } from "./table.validation";

    const router = express.Router();
    
    router.post("/create-table", validateRequest(tablePostValidation), tableController.postTable);
    router.get("/all-table", tableController.getAllTable);
    router.get("/single-table/:id", tableController.getSingleTable);
    router.put("/update-table/:id", validateRequest(tableUpdateValidation), tableController.updateTable);
    router.delete("/delete-table/:id", tableController.deleteTable);
    
    export const tableRoutes = router;