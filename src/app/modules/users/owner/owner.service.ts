
import { OWNER_SEARCHABLE_FIELDS } from "./owner.constant";
import QueryBuilder from "../../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../../errors/AppError";
import { OwnerModel } from "./owner.model";

export const ownerService = {
  async postOwnerIntoDB(data: any) {
    try {
      return await OwnerModel.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getAllOwnerFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(OwnerModel.find(), query)
        .search(OWNER_SEARCHABLE_FIELDS)
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
  async getSingleOwnerFromDB(id: string) {
    try {
      return await OwnerModel.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async updateOwnerIntoDB(data: any) {
    try {
      const isDeleted = await OwnerModel.findOne({ _id: data.id });
      if (isDeleted?.isDeleted) {
        throw new AppError(status.NOT_FOUND, "owner is already deleted");
      }

      const result = await OwnerModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("owner not found.");
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
  async deleteOwnerFromDB(id: string) {
    try {
      // Step 1: Check if the owner exists in the database
      const isExist = await OwnerModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "owner not found");
      }

      // Step 4: Delete the home owner from the database
      await OwnerModel.updateOne({ _id: id }, { isDelete: true });
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
