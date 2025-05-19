import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { restaurantLayoutService } from './restaurantLayout.service';

const postRestaurantLayout = catchAsync(async (req, res) => {
  const result = await restaurantLayoutService.postRestaurantLayout(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Restaurant layout created successfully',
    data: result,
  });
});

const getAllRestaurantLayout = catchAsync(async (_req, res) => {
  const result = await restaurantLayoutService.getAllRestaurantLayout();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Restaurant layouts fetched successfully',
    data: result,
  });
});

const getSingleRestaurantLayout = catchAsync(async (req, res) => {
  const result = await restaurantLayoutService.getSingleRestaurantLayout(
    req.params.id
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Restaurant layout fetched successfully',
    data: result,
  });
});

const updateRestaurantLayout = catchAsync(async (req, res) => {
   const user = req.body.user;
  const result = await restaurantLayoutService.updateRestaurantLayout(
    req.params.id,
    user,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Restaurant layout updated successfully',
    data: result,
  });
});

const deleteRestaurantLayout = catchAsync(async (req, res) => {
  const result = await restaurantLayoutService.deleteRestaurantLayout(
    req.params.id
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Restaurant layout deleted successfully',
    data: result,
  });
});

export const restaurantLayoutController = {
  postRestaurantLayout,
  getAllRestaurantLayout,
  getSingleRestaurantLayout,
  updateRestaurantLayout,
  deleteRestaurantLayout,
};
