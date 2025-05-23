import { StaffModel } from "./staff.model";
import { IStaff } from "./staff.interface";
import AppError from "../../../errors/AppError";
import { uploadImgToCloudinary } from "../../../utils/sendImageToCloudinary";
import { UserModel } from "../user/users.model";
import mongoose, { startSession } from "mongoose";
import bcrypt from "bcryptjs";
import { validateData } from "../../../middlewares/validateData ";
import {  staffUpdateValidation } from "./staff.validation";

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
const getAllStaff = async () => {
  const result = await StaffModel.find({ isDeleted: false })
    .populate("user")
    .populate("restaurant");
  return result;
};

const getSingleStaff = async (id: string) => {
  const result = await StaffModel.findById(id)
    .populate("user")
    .populate("restaurant");
  if (!result || result.isDeleted) {
    throw new AppError(404, "Staff not found");
  }
  return result;
};

const updateStaff = async (
  id: string,
  data: any,
  file?: Express.Multer.File
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let imageUrl = data.image || null;

    // If a new image is uploaded
    if (file && file.path) {
      const imageName = `${Math.floor(100 + Math.random() * 900)}`;
      const { secure_url } = (await uploadImgToCloudinary(
        imageName,
        file.path
      )) as {
        secure_url: string;
      };
      imageUrl = secure_url;
    }

    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    const staffData = await StaffModel.findOne({ _id: id });
    if (!staffData) {
      throw new AppError(404, "Staff not found");
    }
    // Update the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      staffData.user,
      userData,
      { new: true, session }
    );

    if (!updatedUser) {
      throw new AppError(404, "User not found");
    }


    const updatedStaff = await StaffModel.findByIdAndUpdate(id, data, {
      new: true,
      session,
    });

    if (!updatedStaff) {
      throw new AppError(404, "Staff not found");
    }

    await session.commitTransaction();
    session.endSession();

    return updatedStaff;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      500,
      "Failed to update staff: " + (error as Error).message
    );
  }
};

const deleteStaff = async (id: string) => {
  const result = await StaffModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(404, "Staff not found");
  }
  return result;
};

export const staffService = {
  createStaff,
  getAllStaff,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};
