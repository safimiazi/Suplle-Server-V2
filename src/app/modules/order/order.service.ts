import { OrderModel } from './order.model';
import { IOrder } from './order.interface';

import AppError from '../../errors/AppError';
import { RestaurantZone } from '../restaurantZone/restaurantZone.model';
import { RestaurantModel } from '../restuarant/restuarant.model';

const createOrder = async (payload: IOrder) => {
  const zone = await  RestaurantZone.findOne({_id: payload.zone});
  if(!zone){
    throw new AppError(400,"zone doesn't found")
  }

  const restaurant = await  RestaurantModel.findOne({_id: payload.restaurant});
 
  if(!restaurant){
    throw new AppError(400,"restaurant doesn't found");
  }

  const result = await OrderModel.create(payload);
  return result;
};

const getAllOrders = async () => {
  const orders = await OrderModel.find({ isDeleted: false })
  return orders;
};

const getSingleOrder = async (id: string) => {
  const order = await OrderModel.findById(id);
  return order;
};

const updateOrder = async (id: string, payload: Partial<IOrder>) => {
  const updated = await OrderModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

   const findOrder = await OrderModel.findOne({_id:id})
  if(!findOrder){
    throw new AppError(400,"order updated Failed");
  }
  return updated;
};

const deleteOrder = async (id: string) => {
  const deleted = await OrderModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return deleted;
};

export const orderServices = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
