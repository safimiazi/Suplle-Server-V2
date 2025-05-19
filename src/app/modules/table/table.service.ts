import status from "http-status";
import AppError from "../../errors/AppError";
import { TableModel } from "./table.model";
import { ITable } from "./table.interface";
import { tablePostValidation } from "./table.validation";
import QueryBuilder from "../../builder/QueryBuilder";
import { TABLE_SEARCHABLE_FIELDS } from "./table.constant";

export const tableService = {
  async postTableIntoDB(data: ITable) {
    try {

      return await TableModel.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while creating table.");
      }
    }
  },

  async getAllTableFromDB(query: any) {
    try {
     
      const result = await TableModel.find({})
  

      return result ;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching all tables.");
      }
    }
  },

  async getSingleTableFromDB(id: string) {
    try {
      const table = await TableModel.findById(id);
      if (!table) {
        throw new AppError(status.NOT_FOUND, "Table not found");
      }
      return table;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching the table.");
      }
    }
  },

  async updateTableIntoDB(id: string, data: Partial<ITable>) {
    try {
      const table = await TableModel.findById(id);
      if (!table || table.isDeleted) {
        throw new AppError(status.NOT_FOUND, "Table is already deleted or not found");
      }

      const result = await TableModel.findByIdAndUpdate(id, data, { new: true });
      if (!result) {
        throw new AppError(status.NOT_FOUND, "Table update failed");
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while updating the table.");
      }
    }
  },

  async deleteTableFromDB(id: string) {
    try {
      const table = await TableModel.findByIdAndDelete(id);
      if (!table) {
        throw new AppError(status.NOT_FOUND, "Table not found");
      }

      

      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while deleting the table.");
      }
    }
  },
};
