import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import { OrderModel } from "../../order/order.model";
import { RestaurantModel } from "../../restuarant/restuarant.model";


const allAnalytic = async (restaurantId: string) => {
    const orders = await OrderModel.find({
      restaurant: restaurantId,
      isDeleted: false,
    });
    
  
    if (!orders || orders.length === 0) {
      return {
        totalRevenue: 0,
        averageOrderValue: 0,
        totalOrders: 0,
        averageCustomerRating: 0,
      };
    }
  
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalRevenue / totalOrders;



    //for admin
    
    const totalRestaurant = await RestaurantModel.find({});
    console.log(totalRestaurant)
  
    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      totalOrders,
      averageCustomerRating: 4.2, 
    };
  };



export const analyticService = {
    allAnalytic,

};
