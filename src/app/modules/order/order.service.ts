import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { MenuModel } from "../menu/menu.model";
import { RestaurantZone } from "../restaurantZone/restaurantZone.model";
import { RestaurantModel } from "../restuarant/restuarant.model";
import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";


export const createOrder = async (payload: Omit<IOrder, "total">) => {

  const restaurant = await RestaurantModel.findById(payload.restaurant);
  if (!restaurant) {
    throw new AppError(400, "Restaurant not found");
  }


  const zone = await RestaurantZone.findById(payload.zone);
  if (!zone) {
    throw new AppError(400, "Zone not found");
  }

  let total = 0;

  const validatedMenus = await Promise.all(
    payload.menus.map(async (item) => {
      const menu = await MenuModel.findById(item.menu);
      if (!menu) {
        throw new AppError(400, `Menu item not found: ${item.menu}`);
      }

      total += menu.price * item.quantity;

      return {
        menu: item.menu,
        quantity: item.quantity,
      };
    })
  );

  const orderData: IOrder = {
    ...payload,
    menus: validatedMenus,
    total
  };

  const result = await OrderModel.create(orderData);
  return result;
};


const getAllOrders = async (query: any = {}) => {
  try {
    const ORDER_SEARCHABLE_FIELDS = ['customerName', 'customerPhone', 'orderType', 'status'];

    const service_query = new QueryBuilder(OrderModel.find(), query)
      .search(ORDER_SEARCHABLE_FIELDS)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await service_query.modelQuery.populate([
      {
        path: "restaurant",
        select: "name address contact",
      },
      {
        path: "zone",
        select: "name description",
      },
      {
        path: "menus.menu",
        select: "itemName price size",
      }
    ]);

    const meta = await service_query.countTotal();

    return {
      result,
      meta,
    };
  } catch (error) {
    throw error;
  }
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
