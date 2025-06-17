import { UserModel } from "./users.model";
import { IUser } from "./users.interface";
import AppError from "../../../errors/AppError";
import { uploadImgToCloudinary } from "../../../utils/sendImageToCloudinary";
import { validateData } from "../../../middlewares/validateData ";
import { usersUpdateValidation } from "./users.validation";
import mongoose, { UpdateQuery } from "mongoose";
import { sendUserLoginCredentials } from "../../../utils/subUserEmailTamplate";
import { OwnerModel } from "../owner/owner.model";

import bcrypt from "bcryptjs";
import { USERS_SEARCHABLE_FIELDS } from "./users.constant";
import QueryBuilder from "../../../builder/QueryBuilder";
import path from "path";
import { populate } from "dotenv";

const createUser = async (data: IUser, owner: any) => {
  console.log(data)
  const session = await UserModel.startSession();
  session.startTransaction();

  try {
    // 1. Check if user already exists
    const existingUser = await UserModel.findOne({ email: data.email }).session(
      session
    );
    if (existingUser) {
      throw new AppError(409, "User already exists");
    }

    let modifiedData: any = { ...data };

    modifiedData.restaurant = owner.restaurant;
    // 3. Hash the password before saving to the database
    modifiedData.password = await bcrypt.hash(modifiedData.password, 10); // 10 is salt rounds

    // 2. Create new user with session
    const result = await UserModel.create([modifiedData], { session });
    const user = result[0];

    if (!user) {
      throw new AppError(400, "Failed to create user");
    }

    // 3. Send credentials (optional: can be outside transaction)
    await sendUserLoginCredentials(
      user.email,
      data.password,
      user.name,
      user.role,
      user.phone
    );

    await session.commitTransaction();
    return {
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error; // Preserve original error
  } finally {
    session.endSession();
  }
};

const getAllUsers = async (query: any) => {
  try {
    const service_query = new QueryBuilder(UserModel.find(), query)
      .search(USERS_SEARCHABLE_FIELDS)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await service_query.modelQuery
      .select("-password")
      .populate({
        path: "restaurant",
        populate: {
          path: "owner",
          populate: {
            path: "user",
            select: "name email phone role isDeleted",
          }
        }
      });
    const meta = await service_query.countTotal();
    return {
      result,
      meta,
    };
  } catch (error: unknown) {
    throw error;
  }
};
const getAllUsersForOwner = async (query: any, restaurantId: string) => {
  try {
    const service_query = new QueryBuilder(
      UserModel.find({
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        role: { $ne: "admin" },
        isDeleted: false,
      }),
      query
    )
      .search(USERS_SEARCHABLE_FIELDS)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await service_query.modelQuery.select("-password"); // Only user fields, no populate

    const meta = await service_query.countTotal();

    return {
      result,
      meta,
    };
  } catch (error: unknown) {
    console.error("Error in getAllUsersForOwner:", error);
    throw error;
  }
};




const getSingleUser = async (id: string) => {
  const result = await UserModel.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(404, "User not found");
  }
  return result;
};

const updateUser = async (
  id: string,
  data: any,
  file?: Express.Multer.File
) => {
  const parsedData = JSON.parse(data);

  if (file && file.path) {
    const imageName = `${Math.floor(100 + Math.random() * 900)}`;
    const { secure_url } = (await uploadImgToCloudinary(
      imageName,
      file.path
    )) as {
      secure_url: string;
    };
    parsedData.image = secure_url;
  }

  const Data = (await validateData(
    usersUpdateValidation,
    parsedData
  )) as UpdateQuery<IUser>;

  const result = await UserModel.findByIdAndUpdate(id, Data, { new: true });
  if (!result) {
    throw new AppError(404, "User not found");
  }
  return result;
};

const deleteUser = async (id: string) => {
  const result = await UserModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(404, "User not found");
  }
  return result;
};

export const userService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getAllUsersForOwner
};
