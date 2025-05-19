import { RestaurantModel } from "./restuarant.model";
import { IRestaurant } from "./restuarant.interface";
import AppError from "../../errors/AppError";

const postRestaurant = async (data:IRestaurant) => {
  const result = await RestaurantModel.create(data);
  return result;
};

const getAllRestaurant = async () => {
  const result = await RestaurantModel.find({ isDeleted: false });
  return result;
};

const getSingleRestaurant = async (id: string) => {
  const result = await RestaurantModel.findById(id);
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

export const restaurantService = {
  postRestaurant,
  getAllRestaurant,
  getSingleRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
