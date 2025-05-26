import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { MenuModel } from "../menu/menu.model";
import { RestaurantZone } from "../restaurantZone/restaurantZone.model";
import { RestaurantModel } from "../restuarant/restuarant.model";
import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import { generateOrderId } from "./order.utils/generateOrderId";


export const createOrder = async (payload: Omit<IOrder, "total">) => {

const orderId = await generateOrderId();

  const restaurant = await RestaurantModel.findById(payload.restaurant);
  if (!restaurant) {
    throw new AppError(400, "Restaurant not found");
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
    orderId,
    menus: validatedMenus,
    total
  };
  const result = await OrderModel.create(orderData);
  return result;
};


const getAllOrders = async (query: any = {}) => {
  try {
    const ORDER_SEARCHABLE_FIELDS = ['customerName', 'customerPhone', 'orderType', 'status','isDeleted'];

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
const getSingleOrder = async (id: string, query: any = {}) => {

  const existingOrder = await OrderModel.findById(id);
  if (!existingOrder || existingOrder.isDeleted) {
    throw new AppError(400, "the order is not exist");
  }

  const service_query = new QueryBuilder(OrderModel.find({_id:id}), query)
    .fields();

  const order = await service_query.modelQuery.populate([
    {
      path: "restaurant", 
    },
    {
      path: "menus.menu",
      select: "itemName price size",
    }
  ]);

  return order;
};



const updateOrder = async (id: string, payload: Partial<IOrder>) => {

  const existingOrder = await OrderModel.findOne({_id: id, isDeleted: false});
  if (!existingOrder || existingOrder.isDeleted) {
    throw new AppError(400, "Cannot update a deleted order");
  }
  const isCurrentRestaurant = await OrderModel.findOne({_id:id,restaurant: payload.restaurant});
  if(!isCurrentRestaurant ){
    throw new AppError(400, "you can not update order from another restaurant");
  }

  if (payload.restaurant) {
    const restaurant = await RestaurantModel.findById(payload.restaurant);
    if (!restaurant) {
      throw new AppError(400, "Restaurant not found");
    }
  }

  let total = existingOrder.total;
  if (payload.menus) {
    total = 0;

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

    payload.menus = validatedMenus;
    payload.total = total;
  }

  const updatedOrder = await OrderModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate([
    { path: "restaurant" },
    { path: "menus.menu", select: "itemName price size" },
  ]);

  return updatedOrder;
};


const deleteOrder = async (id: string,restaurant: string) => {
  const findOrder = await OrderModel.findOne({_id: id, isDeleted: false});
  if (!findOrder || findOrder.isDeleted){
    throw new AppError(400, "Cannot delete a deleted order");
  }
  const isCurrentRestaurant = await OrderModel.findOne({_id:id,restaurant:restaurant});
  if(!isCurrentRestaurant ){
    throw new AppError(400, "you can not update order from another restaurant");
  }
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
