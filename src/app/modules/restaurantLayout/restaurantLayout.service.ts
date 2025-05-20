import { RestaurantLayoutModel } from './restaurantLayout.model';
import { IRestaurantLayout } from './restaurantLayout.interface';
import AppError from '../../errors/AppError';
import { RestaurantModel } from '../restuarant/restuarant.model';
import { FloorModel } from '../floor/floor.model';
import { OwnerModel } from '../users/owner/owner.model';
import mongoose from 'mongoose';
import { toObjectId } from '../../utils/ConvertObjectId';
import { RestaurantZone } from '../restaurantZone/restaurantZone.model';


const postRestaurantLayout = async (payload: IRestaurantLayout) => {


 
  const isRestaurantExists =  await RestaurantModel.findById({_id: payload.restaurant});
  if(!isRestaurantExists){
    throw new AppError(400,"the restaurant is not exist");
  }

  const allRestaurantZone = (await RestaurantZone.find({}));
  const floor = allRestaurantZone[0].floor;

  const tableNumber =  (await RestaurantZone.find({})).length;
    
    (payload as any).numberOfTables = tableNumber;
    (payload as any).floor= floor;
  if(!allRestaurantZone){
    throw new AppError(400,"please create layout first");
  }
  

  const result = await RestaurantLayoutModel.create(payload);
  return result;
};

const getAllRestaurantLayout = async () => {
  const result = await RestaurantLayoutModel.find({ isDeleted: false })
    .populate({
      path: 'restaurant',
      populate: {
        path: 'menus',
        model: 'Menu'  
      }
    })
    .populate('floor');

  return result;
};


const getSingleRestaurantLayout = async (id: string) => {
  const result = await RestaurantLayoutModel.findById(id)
    .populate('floor')
    .populate({
      path: 'restaurant',
      populate: {
        path: 'menus', // this will now populate the menu documents
      },
    });

  if (!result || result.isDeleted) {
    throw new AppError(404, 'Restaurant layout not found');
  }

  return result;
};

const updateRestaurantLayout = async (
  id: string,
  user: string,
  payload: Partial<IRestaurantLayout>
) => {



  
  const floor = await FloorModel.findOne({
    _id: new mongoose.Types.ObjectId(payload.floor),
    isDeleted: false,
  });

  if (!floor) {
    throw new AppError(403, "No floor found");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid Restaurant Layout ID");
  }
  if (!mongoose.Types.ObjectId.isValid(user)) {
    throw new AppError(400, "Invalid User ID");
  }

  const restaurantOwner = await OwnerModel.findOne({
    user: new mongoose.Types.ObjectId(user),
    isDeleted: false,
  });

  if (!restaurantOwner) {
    throw new AppError(403, "No owner found for the given user");
  }

  const updated = await RestaurantLayoutModel.findByIdAndUpdate(id, payload, {
    new: true,
  })
  if (!updated) {
    throw new AppError(404, "Restaurant layout not found");
  }

  return updated;
};


const deleteRestaurantLayout = async (id: string) => {
  const deleted = await RestaurantLayoutModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!deleted) {
    throw new AppError(404, 'Restaurant layout not found');
  }
  return deleted;
};

export const restaurantLayoutService = {
  postRestaurantLayout,
  getAllRestaurantLayout,
  getSingleRestaurantLayout,
  updateRestaurantLayout,
  deleteRestaurantLayout,
};
