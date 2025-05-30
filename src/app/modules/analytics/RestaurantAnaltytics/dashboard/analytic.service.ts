import { OrderModel } from "../../../order/order.model";
import { DailyRevenueModel } from "./DailyRevenueModel";
import { MonthlyRevenueModel } from "./MonthlyRevenueModel"; 

// Helper function to convert 'YYYY-MM' to 'Month Year' string
function formatMonthName(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export const allAnalytic = async (restaurantId: string) => {
  const orders = await OrderModel.find({
    restaurant: restaurantId,
    isDeleted: false,
  });

  const SuccessfulOrders = await OrderModel.find({
    restaurant: restaurantId,
    status: 'delivered',
    isDeleted: false,
  });

  if (!orders || orders.length === 0) {
    return {
      totalOrders: 0,
      CancelOrders: 0,
      totalCustomers: 0,
      revenue: {
        total: 0,
        daily: [],
        weekly: 0,
        monthly: 0,
        weeklyComparison: 0,
        weeklyComparisonComment: "No data to compare",
        monthlyAll: [],
      }
    };
  }

  // Group daily revenue
  const dailyRevenueMap: Record<string, number> = {};
  for (const order of SuccessfulOrders) {
    const createdAt = order.createdAt ?? new Date();
    const dateKey = new Date(createdAt).toISOString().split('T')[0];
    if (!dailyRevenueMap[dateKey]) {
      dailyRevenueMap[dateKey] = 0;
    }
    dailyRevenueMap[dateKey] += order.total || 0;
  }

  const dailyRevenue = Object.entries(dailyRevenueMap)
    .map(([date, revenue]) => ({
      date,
      revenue: Number(revenue.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Save daily revenue to DB
  for (const { date, revenue } of dailyRevenue) {
    await DailyRevenueModel.findOneAndUpdate(
      { restaurant: restaurantId, date },
      { $set: { totalRevenue: revenue } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // Group monthly revenue
  const monthlyRevenueMap: Record<string, number> = {};
  for (const order of SuccessfulOrders) {
    const createdAt = order.createdAt ?? new Date();
    const monthKey = createdAt.toISOString().slice(0, 7); 
    if (!monthlyRevenueMap[monthKey]) {
      monthlyRevenueMap[monthKey] = 0;
    }
    monthlyRevenueMap[monthKey] += order.total || 0;
  }

  // Save monthly revenue to DB
  for (const [month, revenue] of Object.entries(monthlyRevenueMap)) {
    await MonthlyRevenueModel.findOneAndUpdate(
      { restaurant: restaurantId, month },
      { $set: { totalRevenue: revenue } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // Convert monthly keys to month names and sort
  const monthlyAll = Object.entries(monthlyRevenueMap)
    .sort(([monthA], [monthB]) => new Date(monthA + '-01').getTime() - new Date(monthB + '-01').getTime())
    .map(([month, revenue]) => ({
      month: formatMonthName(month),
      revenue: Number(revenue.toFixed(2)),
    }));

  // Date range calculations for weekly & monthly revenues
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(now.getDate() - 14);

  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Filter orders for these ranges
  const currentWeekOrders = SuccessfulOrders.filter(order => {
    return order.createdAt && order.createdAt >= oneWeekAgo;
  });

  const previousWeekOrders = SuccessfulOrders.filter(order => {
    return order.createdAt && order.createdAt >= twoWeeksAgo && order.createdAt < oneWeekAgo;
  });

  const currentMonthOrders = SuccessfulOrders.filter(order => {
    return order.createdAt && order.createdAt >= firstDayOfMonth;
  });

  // Sum revenues
  const currentWeekRevenue = currentWeekOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const previousWeekRevenue = previousWeekOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  let weeklyComparison = 0;
  let weeklyComparisonComment = "No data to compare";

  if (previousWeekRevenue > 0) {
    weeklyComparison = Number(
      (((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100).toFixed(1)
    );
    weeklyComparisonComment =
      weeklyComparison > 0
        ? `↑ ${weeklyComparison}% increase from last week`
        : weeklyComparison < 0
        ? `↓ ${Math.abs(weeklyComparison)}% decrease from last week`
        : "No change from last week";
  }

  const CancelOrders = await OrderModel.find({
    restaurant: restaurantId,
    status: 'cancel',
    isDeleted: false,
  });

  const totalRevenue = SuccessfulOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const averageOrderValue = SuccessfulOrders.length > 0
  ? Number((totalRevenue / SuccessfulOrders.length).toFixed(2))
  : 0;

  const totalCustomers = orders.reduce((sum, order, index) => {
    const persons = order.person || 0;
    // console.log(`Order #${index + 1}:`);
    // console.log(`  Order ID: ${order._id}`);
    // console.log(`  Person count: ${persons}`);
    // console.log(`  Running total: ${sum + persons}`);
    return sum + persons;
  }, 0);
  

  return {
    totalOrders: orders.length,
    CancelOrders: CancelOrders.length,
    deliveredOrders: SuccessfulOrders.length,
    totalCustomers,
    revenue: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      averageOrderValue,
      daily: dailyRevenue,
      weekly: Number(currentWeekRevenue.toFixed(2)),
      monthly: Number(currentMonthRevenue.toFixed(2)),
      weeklyComparison,
      weeklyComparisonComment,
      monthlyAll, 
    }
  };
};
