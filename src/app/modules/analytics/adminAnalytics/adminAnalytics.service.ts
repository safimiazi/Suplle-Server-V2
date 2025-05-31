import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import { OrderModel } from "../../order/order.model";
import { RestaurantModel } from "../../restuarant/restuarant.model";
import { UserModel } from "../../users/user/users.model";
import { QrCodeDesignModel } from "../../QrCodeDesign/QrCodeDesign.model";
import { QRCodePurchaseModel } from "../../QRCodePurchase/QRCodePurchase.model";


const allAdminAnalytic = async () => {
  const now = new Date();

  const periods = {
    last12Months: new Date(now.getFullYear(), now.getMonth() - 11, 1),
    last6Months: new Date(now.getFullYear(), now.getMonth() - 5, 1),
    last30Days: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    last7Days: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
  };

  const qrOrders = await QRCodePurchaseModel.find({ isDeleted: false });
  const completedOrders = qrOrders.filter(order => order.status === 'completed');

  // Total orders, users, restaurants
  const totalOrders = qrOrders.length;
  const totalUsers = new Set(qrOrders.map(order => order.user.toString())).size;
  const totalRestaurants = new Set(qrOrders.map(order => order.restaurant.toString())).size;

  // Function to compute stats
  const calculateStats = (orders: any[]) => ({
    orders: orders.length,
    sales: orders.reduce((sum, order) => sum + order.price, 0),
  });

  const salesStats = {
    last12Months: calculateStats(completedOrders.filter(order => order.createdAt >= periods.last12Months)),
    last6Months: calculateStats(completedOrders.filter(order => order.createdAt >= periods.last6Months)),
    last30Days: calculateStats(completedOrders.filter(order => order.createdAt >= periods.last30Days)),
    last7Days: calculateStats(completedOrders.filter(order => order.createdAt >= periods.last7Days)),
  };

  return {
    totalUsers,
    totalOrders,
    completedOrders: completedOrders.length,
    totalRestaurants,
    ...salesStats,
  };
};





export const AdminAnalyticService = {
    allAdminAnalytic,

};
