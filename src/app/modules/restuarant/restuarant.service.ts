import { RestaurantModel } from "./restuarant.model";
import { IRestaurant } from "./restuarant.interface";
import AppError from "../../errors/AppError";
import { UserModel } from "../users/user/users.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { OwnerModel } from "../users/owner/owner.model";


export const postRestaurant = async (data: any, ownerId: string, userId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Create restaurant document
    const restaurant = await RestaurantModel.create([data], { session });
    const newRestaurant = restaurant[0];

    // 2. Add restaurant reference to Owner's restaurants array
    await OwnerModel.findByIdAndUpdate(
      ownerId,
      { $push: { restaurant: newRestaurant._id } },
      { session }
    );

    // 3. Add restaurant reference to User's restaurants array
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { restaurant: newRestaurant._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return newRestaurant;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllRestaurant = async () => {
  const result = await RestaurantModel.find({ isDeleted: false });
  return result;
};

const getSingleRestaurant = async (id: string) => {
  const result = await RestaurantModel.findById(id)
    .where({ isDeleted: false })
    .select('-__v -isDeleted -updatedAt')
    .populate({
      path: 'owner',
      select: 'name email'
    })
    .populate({
      path: 'menus',
      select: 'menuName items'
    });

  if (!result) {
    throw new AppError(404, 'Restaurant not found');
  }

  return result;
};





const updateRestaurant = async (id: string, payload: Partial<IRestaurant>) => {

  const result = await RestaurantModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(404, "Restaurant not found");
  }
  return result;
};
const updateRestaurantByAdmin = async (id: string, payload: Partial<IRestaurant>) => {

  const result = await RestaurantModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(404, "Restaurant not found");
  }
  return result;
};

const deleteRestaurant = async (id: string) => {
  const result = await RestaurantModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(404, "Restaurant not found");
  }
  return result;
};

const accountSettings = async (userId: string, oldPassword: string, newPassword: string) => {
  // Find user by restaurant

  const owner = await OwnerModel.findOne({ user: userId });

  if (!owner) {
    throw new AppError(httpStatus.NOT_FOUND, "Owner not found");
  }

  const user = await UserModel.findOne({ _id: owner.user }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "This account uses OAuth and does not support password changes.");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;

  await user.save();

  return {
    message: "Password updated successfully"
  };
};




export const restaurantService = {
  postRestaurant,
  getAllRestaurant,
  getSingleRestaurant,
  updateRestaurant,
  deleteRestaurant,
  updateRestaurantByAdmin,
  accountSettings
};
