import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import { QRCodePurchaseModel } from "../../QRCodePurchase/QRCodePurchase.model";

const allAdminAnalytic = async () => {
  const now = new Date();

  const periods = {
    last12Months: new Date(now.getFullYear(), now.getMonth() - 11, 1),
    last6Months: new Date(now.getFullYear(), now.getMonth() - 5, 1),
    last30Days: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    last7Days: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    startOfMonth: new Date(now.getFullYear(), now.getMonth(), 1),
  };

  const qrOrders = await QRCodePurchaseModel.find({ isDeleted: false });
  const completedOrders = qrOrders.filter(order => order.status === 'completed');

  const totalOrders = qrOrders.length;
  const totalUsers = new Set(qrOrders.map(order => order.user.toString())).size;
  const totalRestaurants = new Set(qrOrders.map(order => order.restaurant.toString())).size;

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

  // Monthly stats (Jan to Dec)
  const monthlyStats = Array.from({ length: 12 }, (_, i) => {
    const start = new Date(now.getFullYear(), i, 1);
    const end = new Date(now.getFullYear(), i + 1, 0, 23, 59, 59);

    const monthlyOrders = completedOrders.filter(order => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= start && createdAt <= end;
    });

    return {
      month: start.toLocaleString('default', { month: 'short' }),
      sales: monthlyOrders.reduce((sum, order) => sum + order.price, 0),
      orders: monthlyOrders.length,
    };
  });

  // Day-wise stats for current month
  const currentMonthDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayWiseMonthStats = Array.from({ length: currentMonthDays }, (_, i) => {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), i + 1);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), i + 1, 23, 59, 59);

    const dayOrders = completedOrders.filter(order => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= dayStart && createdAt <= dayEnd;
    });

    return {
      day: i + 1,
      sales: dayOrders.reduce((sum, order) => sum + order.price, 0),
      orders: dayOrders.length,
    };
  });

  // Day-wise stats for current week (last 7 days)
  const dayWiseWeekStats = Array.from({ length: 7 }, (_, i) => {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59);

    const dayOrders = completedOrders.filter(order => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= dayStart && createdAt <= dayEnd;
    });

    return {
      date: dayStart.toISOString().split("T")[0], // YYYY-MM-DD
      sales: dayOrders.reduce((sum, order) => sum + order.price, 0),
      orders: dayOrders.length,
    };
  });

  return {
    totalUsers,
    totalOrders,
    completedOrders: completedOrders.length,
    totalRestaurants,
    ...salesStats,
    monthlyStats,
    dayWiseMonthStats,
    dayWiseWeekStats,
  };
};


export const AdminAnalyticService = {
  allAdminAnalytic,
};
