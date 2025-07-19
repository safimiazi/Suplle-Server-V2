import { SubscriptionPlanModel } from "./SubscriptionPlan.model";
import { SUBSCRIPTIONPLAN_SEARCHABLE_FIELDS } from "./SubscriptionPlan.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";

export const SubscriptionPlanService = {
  async postSubscriptionPlanIntoDB(data: any) {
    try {

      const alreadyExist = await SubscriptionPlanModel.findOne({
        state: data.state,
      });
      if (alreadyExist) {
        throw new Error("Subscription plan already exist!");
      }

      return await SubscriptionPlanModel.create(data);
    } catch (error: unknown) {
      throw error;
    }
  },
  async getAllSubscriptionPlanFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(
        SubscriptionPlanModel.find(),
        query
      )
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
               throw error;


    }
  },
  async getSingleSubscriptionPlanFromDB(id: string) {
    try {
      const result = await SubscriptionPlanModel.findById(id);
      if(result?.isDeleted){
        throw new Error("SubscriptionPlan is already deleted!")
      }
      return result;
    } catch (error: unknown) {
               throw error;


    }
  },
  async updateSubscriptionPlanIntoDB(data: any, id: string) {
    try {
      const existing = await SubscriptionPlanModel.findOne({ _id: id });
      if (!existing || existing.isDeleted) {
        throw new Error("SubscriptionPlan is already deleted or not found.");
      }

      // prepare safe update payload:

     

      const result = await SubscriptionPlanModel.findByIdAndUpdate(
        id,
        {
          $set: data,
        },
        { new: true }
      );

      if (!result) {
        throw new Error("Subscription not found.");
      }

      return result
    } catch (error: unknown) {
      throw error;
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
      await SubscriptionPlanModel.updateOne({ _id: id }, { isDeleted: true });
      return;
    } catch (error: unknown) {
               throw error;


    }
  },
};
