import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { usersRoutes } from "../modules/users/user/users.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { menuRoutes } from "../modules/menu/menu.routes";
import { floorRoutes } from "../modules/floor/floor.routes";
import { orderRoutes } from "../modules/order/order.routes";
import { tableRoutes } from "../modules/table/table.routes";
import { restaurantZoneRoutes } from "../modules/restaurantZone/restaurantZone.routes";
import { restaurantLayoutRoutes } from "../modules/restaurantLayout/restaurantLayout.routes";
import { restuarantRoutes } from "../modules/restuarant/restuarant.routes";
import { staffRoutes } from "../modules/users/staff/staff.routes";
import { analyticsRoutes } from "../modules/analytics/RestaurantAnaltytics/analytic.route";
import { AdminAnalyticsRoutes } from "../modules/analytics/adminAnalytics/adminAnalytics.route";


const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: usersRoutes,

  }
,{
    path: "/categories",
    route: categoryRoutes,

  },{
    path:"/menus",
    route: menuRoutes
  },{
    path:"/floor",
    route: floorRoutes
  },{
    path:"/order",
    route: orderRoutes
  },{
    path:"/table",
    route: tableRoutes
  },{
    path:"/zone",
    route:  restaurantZoneRoutes ,
  },{
    path:"/orders",
    route: orderRoutes,
  },{
    path:"/layout",
    route: restaurantLayoutRoutes,
  },{
    path:"/restaurant",
    route: restuarantRoutes,
  },{
    path:"/staff",
    route: staffRoutes,
  },{
    path:"/analytics",
    route: analyticsRoutes
  },{
    path:"/admin-analytics",
    route: AdminAnalyticsRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
