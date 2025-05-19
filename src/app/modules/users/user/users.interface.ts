export type IUserRole =
  | "admin"
  | "restaurant_owner"
  | "staff"
  | "customer"
  | "manager"
  | "dine in"
  | "waiter"
  | "chief"
  | "cashier"
  | "maintenance";

export type IUser = {
  _id: string;
  name: string;
  otp: string;
  otpExpiresAt: Date;
  providerId?: string;
  provider?: string;
  email: string;
  phone: string;
  role: IUserRole;
  image: string;
  password: string;
  isDeleted: boolean;
};
