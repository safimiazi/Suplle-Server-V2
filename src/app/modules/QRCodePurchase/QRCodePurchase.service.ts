import { QRCodePurchaseModel } from "./QRCodePurchase.model";
      import { QRCODEPURCHASE_SEARCHABLE_FIELDS } from "./QRCodePurchase.constant";
    import QueryBuilder from "../../builder/QueryBuilder";
    import status from "http-status";
    import AppError from "../../errors/AppError";
    




    export const QRCodePurchaseService = {
      async postQRCodePurchaseIntoDB(data: any) {
      try {
        return await QRCodePurchaseModel.create(data);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getAllQRCodePurchaseFromDB(query: any) {
      try {
    
    
      const service_query = new QueryBuilder(QRCodePurchaseModel.find(), query)
            .search(QRCODEPURCHASE_SEARCHABLE_FIELDS)
            .filter()
            .sort()
            .paginate()
            .fields();
      
          const result = await service_query.modelQuery;
          const meta = await service_query.countTotal();
          return {
            result,
            meta,
          };
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getSingleQRCodePurchaseFromDB(id: string) {
        try {
        return await QRCodePurchaseModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async updateQRCodePurchaseIntoDB(data: any) {
      try {
    
    
    
      const isDeleted = await QRCodePurchaseModel.findOne({ _id: data.id });
        if (isDeleted?.isDelete) {
          throw new AppError(status.NOT_FOUND, "QRCodePurchase is already deleted");
        }
    
        const result = await QRCodePurchaseModel.updateOne({ _id: data.id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("QRCodePurchase not found.");
        }
        return result;
    
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async deleteQRCodePurchaseFromDB(id: string) {
        try {
    
    
     // Step 1: Check if the QRCodePurchase exists in the database
        const isExist = await QRCodePurchaseModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "QRCodePurchase not found");
        }
    
        // Step 4: Delete the home QRCodePurchase from the database
        await QRCodePurchaseModel.updateOne({ _id: id }, { isDelete: true });
        return;
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
    };