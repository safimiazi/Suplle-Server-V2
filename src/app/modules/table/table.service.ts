import { tableModel } from "./table.model";
import { TABLE_SEARCHABLE_FIELDS } from "./table.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";
import { generateTableQRCode } from "../../utils/generateQRCode";





export const tableService = {
  async postTableIntoDB(data: any) {
    try {
      let tables = [];
      for (let i = 1; i <= data.numTables; i++) {
        const table = await tableModel.create({
          name: `Table ${i}`,
          restaurant: data.restaurant,
          floor: data.floor,
          capacity: data.capacity,
        })
        const qrCode = await generateTableQRCode(table._id.toString(), data.restaurant)
        table.qrCodeUrl = qrCode;;
        await table.save();


        tables.push(table);
      }

      return tables;

    } catch (error: unknown) {
      throw error;
    }
  },
  async getAllTableFromDB(query: any, floorId: string) {
 
    try {

   if (!floorId) {
      throw new AppError(status.BAD_REQUEST, "Floor ID is required");
    }
      const service_query = new QueryBuilder(tableModel.find({floor: floorId}), query)
        .search(TABLE_SEARCHABLE_FIELDS)
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
  async getSingleTableFromDB(id: string) {
    try {
      const result =  await tableModel.findById(id);
      if (!result) {
        throw new AppError(status.NOT_FOUND, "Table not found");
      }
      if (result.isDeleted) {
        throw new AppError(status.NOT_FOUND, "Table is already deleted");
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
  async updateTableIntoDB(data: any) {
    try {



      const isDeleted = await tableModel.findOne({ _id: data.id });
      if (isDeleted?.isDeleted) {
        throw new AppError(status.NOT_FOUND, "table is already deleted");
      }

      const result = await tableModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("table not found.");
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
  async deleteTableFromDB(id: string) {
    try {


      // Step 1: Check if the table exists in the database
      const isExist = await tableModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "table not found");
      }

      // Step 4: Delete the home table from the database
      await tableModel.updateOne({ _id: id }, { isDeleted: true });
      return;

    } catch (error: unknown) {
     throw error;
    }
  },
};