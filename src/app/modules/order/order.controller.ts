
import httpStatus from 'http-status';
import { orderServices } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { OrderModel } from './order.model';


const createOrder = catchAsync(async (req, res) => {

  const user: any = req.user;
  const data = req.body;

  const orderType = data.orderType;
  if (orderType != user.role) {
    throw new AppError(400, `You can not take ${orderType} order`);
  }
  

  const result = await orderServices.createOrder({ ...data, restaurant: user.restaurant });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order created successfully',
    data: result,
  });
});


const getAllOrders = catchAsync(async (req, res) => {
  const query = req.query;
  const user: any = req.user;

  const result = await orderServices.getAllOrders(query, user.restaurant);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders fetched successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const result = await orderServices.getSingleOrder(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order fetched successfully',
    data: result,
  });
});


const updateOrder = catchAsync(async (req, res) => {
  const user: any = req.user;
  const data = req.body;


  const orderType = data.orderType;
  if (orderType) {
    if (orderType != user.role) {
      throw new AppError(400, `You can not update ${orderType} order`);
    }

  }
  const result = await orderServices.updateOrder(req.params.id, { ...data, restaurant: user.restaurant });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order updated successfully",
    data: result,
  });
});


const deleteOrder = catchAsync(async (req, res) => {
  const user: any = req.user;
  const restaurant = user.restaurant;
  const orderId = req.params.id;

  console.log(orderId)

  const order = await OrderModel.findOne({ _id: orderId })
  const orderType = order?.orderType;

  if (orderType != user.role) {
    throw new AppError(400, `You can not update ${orderType} order`);
  }

  const result = await orderServices.deleteOrder(req.params.id, restaurant);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const orderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
