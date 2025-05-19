
import httpStatus from 'http-status';
import { orderServices } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createOrder = catchAsync(async (req, res) => {
  const result = await orderServices.createOrder(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (_req, res) => {
  const result = await orderServices.getAllOrders();
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
  const result = await orderServices.updateOrder(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const result = await orderServices.deleteOrder(req.params.id);
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
