import { RestaurantModel } from "./restuarant.model";
import { IRestaurant } from "./restuarant.interface";
import AppError from "../../errors/AppError";
import { UserModel } from "../users/user/users.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

const postRestaurant = async (data: IRestaurant) => {
  const result = await RestaurantModel.create(data);
  return result;
};

const getAllRestaurant = async () => {
  const result = await RestaurantModel.find({ isDeleted: false });
  return result;
};

const getSingleRestaurant = async (id: string) => {
  const result = await RestaurantModel.findById(id).populate('menus');

  if (!result || result.isDeleted) {
    throw new AppError(404, "Restaurant not found");
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

const accountSettings = async (restaurantId: string, oldPassword: string, newPassword: string) => {
  // Find user by restaurant
  const user = await UserModel.findOne({ restaurant: restaurantId }).select("+password");

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
