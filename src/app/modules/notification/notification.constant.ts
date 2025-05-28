export const NOTIFICATION_SEARCHABLE_FIELDS = [];

// constants/notificationTypes.ts

export const NOTIFICATION_TYPE = {
  USER_REGISTERED: "user_registered",
  TOUR_COMPLETED: "tour_completed",
  SUBSCRIPTION_MADE: "subscription_made",
  RESTAURANT_CREATED: "restaurant_created",
  TABLE_BOOKED: "table_booked",
  STAFF_ADDED: "staff_added",
  MENU_ITEM_ADDED: "menu_item_added",
  ORDER_PLACED: "order_placed",
  ORDER_COMPLETED: "order_completed",
  CUSTOMER_FEEDBACK: "customer_feedback",
} as const;

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
