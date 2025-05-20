import { QrCodeDesignModel } from "./QrCodeDesign.model";
      import { QRCODEDESIGN_SEARCHABLE_FIELDS } from "./QrCodeDesign.constant";
    import QueryBuilder from "../../builder/QueryBuilder";
    import status from "http-status";
    import AppError from "../../errors/AppError";
    




    export const QrCodeDesignService = {
      async postQrCodeDesignIntoDB(data: any) {
      try {
        return await QrCodeDesignModel.create(data);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getAllQrCodeDesignFromDB(query: any) {
      try {
    
    
      const service_query = new QueryBuilder(QrCodeDesignModel.find(), query)
            .search(QRCODEDESIGN_SEARCHABLE_FIELDS)
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
      async getSingleQrCodeDesignFromDB(id: string) {
        try {
        return await QrCodeDesignModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async updateQrCodeDesignIntoDB(data: any) {
      try {
    
    
    
      const isDeleted = await QrCodeDesignModel.findOne({ _id: data.id });
        if (isDeleted?.isDelete) {
          throw new AppError(status.NOT_FOUND, "QrCodeDesign is already deleted");
        }
    
        const result = await QrCodeDesignModel.updateOne({ _id: data.id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("QrCodeDesign not found.");
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
      async deleteQrCodeDesignFromDB(id: string) {
        try {
    
    
     // Step 1: Check if the QrCodeDesign exists in the database
        const isExist = await QrCodeDesignModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "QrCodeDesign not found");
        }
    
        // Step 4: Delete the home QrCodeDesign from the database
        await QrCodeDesignModel.updateOne({ _id: id }, { isDelete: true });
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