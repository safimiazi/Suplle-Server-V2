import { SubscriptionPlanModel } from "./SubscriptionPlan.model";
      import { SUBSCRIPTIONPLAN_SEARCHABLE_FIELDS } from "./SubscriptionPlan.constant";
    import QueryBuilder from "../../builder/QueryBuilder";
    import status from "http-status";
    import AppError from "../../errors/AppError";
    




    export const SubscriptionPlanService = {
      async postSubscriptionPlanIntoDB(data: any) {
      try {
        return await SubscriptionPlanModel.create(data);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getAllSubscriptionPlanFromDB(query: any) {
      try {
    
    
      const service_query = new QueryBuilder(SubscriptionPlanModel.find(), query)
            .search(SUBSCRIPTIONPLAN_SEARCHABLE_FIELDS)
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
      async getSingleSubscriptionPlanFromDB(id: string) {
        try {
        return await SubscriptionPlanModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async updateSubscriptionPlanIntoDB(data: any) {
      try {
    
    
    
      const isDeleted = await SubscriptionPlanModel.findOne({ _id: data.id });
        if (isDeleted?.isDelete) {
          throw new AppError(status.NOT_FOUND, "SubscriptionPlan is already deleted");
        }
    
        const result = await SubscriptionPlanModel.updateOne({ _id: data.id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("SubscriptionPlan not found.");
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
      async deleteSubscriptionPlanFromDB(id: string) {
        try {
    
    
     // Step 1: Check if the SubscriptionPlan exists in the database
        const isExist = await SubscriptionPlanModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "SubscriptionPlan not found");
        }
    
        // Step 4: Delete the home SubscriptionPlan from the database
        await SubscriptionPlanModel.updateOne({ _id: id }, { isDelete: true });
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