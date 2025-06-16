import { StaffModel } from "./staff.model";
import { DaysOfWeekEnum, IStaff } from "./staff.interface";
import AppError from "../../../errors/AppError";
import { uploadImgToCloudinary } from "../../../utils/sendImageToCloudinary";
import { UserModel } from "../user/users.model";
import mongoose, { startSession } from "mongoose";
import bcrypt from "bcryptjs";
import { validateData } from "../../../middlewares/validateData ";
import { staffUpdateValidation } from "./staff.validation";
import QueryBuilder from "../../../builder/QueryBuilder";
import { STAFF_SEARCHABLE_FIELDS } from "./staff.constant";

const createStaff = async (data: any, file: Express.Multer.File) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { image, ...rest } = data;
    const staffData: any = { ...rest };


    // Check if user with the same email already exists
    const existingUser = await UserModel.findOne({ email: staffData.email }).session(session);
    if (existingUser) {
      throw new AppError(409, "User with this email already exists.");
    }
    if (file && file.path) {
      const imageName = `${Math.floor(100 + Math.random() * 900)}`;
      const { secure_url } = (await uploadImgToCloudinary(
        imageName,
        file.path
      )) as {
        secure_url: string;
      };
      staffData.image = secure_url;
    }

    // Create user
    const userData = {
      restaurant: staffData.restaurant,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      role: staffData.role,
      image: staffData.image,
    };

    const createUser = await UserModel.create([userData], { session });

    // Prepare staff data
    const staffDoc = {
      user: createUser[0]._id,
      restaurant: staffData.restaurant,
      workDays: staffData.workDays,
      workTime: staffData.workTime,
      status: staffData.status
    };


    const createdStaff = await StaffModel.create([staffDoc], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return createdStaff[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getAllStaff = async (query: any) => {
  try {
    const service_query = new QueryBuilder(StaffModel.find(), query)
      .search(STAFF_SEARCHABLE_FIELDS)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await service_query.modelQuery
    const meta = await service_query.countTotal();
    return {
      result,
      meta,
    };
  } catch (error: unknown) {
    throw error;


  }
};

const getSingleStaff = async (id: string) => {
  try {
    const result = await StaffModel.findById(id)
      .populate("user")
      .populate("restaurant");
    if (!result || result.isDeleted) {
      throw new AppError(404, "Staff not found");
    }
    return result;
  } catch (error) {
    throw error
  }
};

const updateStaff = async (
  id: string,
  data: any,
  file?: Express.Multer.File
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //1 get existing staff:

    const staffDoc = await StaffModel.findById(id);

    if (!staffDoc) {
      throw new Error("Staff not found.")
    }

    //2. get linked user:

    const userId = staffDoc.user;

    const userDoc = await UserModel.findById(userId);
    if (!userDoc) {
      throw new Error("Linked user not found")
    }



    // 3. Handle image upload if provided
    if (file && file.path) {
      const imageName = `${Math.floor(100 + Math.random() * 900)}`;
      const { secure_url } = (await uploadImgToCloudinary(
        imageName,
        file.path
      )) as { secure_url: string };
      data.image = secure_url; // override image in data
    }



    // Enum validation for workDays
    if (data.workDays) {
      const allowedDays = Object.values(DaysOfWeekEnum) as string[];
      const invalidDays = data.workDays.filter(
        (day: string) => !allowedDays.includes(day)
      );
      if (invalidDays.length > 0) {
        throw new AppError(
          400,
          `Invalid workDays: ${invalidDays.join(", ")}`
        );
      }
    }


    //4. split data into userFields and staff fields:

    const userFields = [
      "name", "email", "phone", "image",
      "role", "restaurant",

    ];

    const staffFields = ["workDays", "workTime", "status", "restaurant"]

    const userUpdateData: any = {};
    const staffUpdateData: any = {};


    for (const key in data) {
      if (userFields.includes(key)) {
        userUpdateData[key] = data[key]
      }
      if (staffFields.includes(key)) {
        staffUpdateData[key] = data[key];
      }
    }


    //5. update user:
    if (Object.keys(userUpdateData).length > 0) {
      await UserModel.findByIdAndUpdate(userId, userUpdateData, { new: true, session })
    }

    // 6. update staff:

    let updatedStaff: any = staffDoc;

    if (Object.keys(staffUpdateData).length > 0) {
      updatedStaff = await StaffModel.findByIdAndUpdate(id, staffUpdateData, { new: true, session })
    }

    // 7. commit transaction:

    await session.commitTransaction();
    session.endSession();

    return updatedStaff;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteStaff = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find staff
    const staff = await StaffModel.findById(id).session(session);
    if (!staff) {
      throw new AppError(404, "Staff not found");
    }

    if (staff.isDeleted) {
      throw new AppError(400, "Staff already deleted");
    }

    // 2. Soft delete staff
    const updatedStaff = await StaffModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    // 3. Soft delete linked user
    const updatedUser = await UserModel.findByIdAndUpdate(
      staff.user,
      { isDeleted: true },
      { new: true, session }
    );

    // 4. Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: "Staff and linked user deleted successfully",
      staff: updatedStaff,
      user: updatedUser,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


export const staffService = {
  createStaff,
  getAllStaff,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};
