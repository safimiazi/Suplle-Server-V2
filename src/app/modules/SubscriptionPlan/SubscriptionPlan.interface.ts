// Step 1: Define TypeScript Interface
export interface ISubscriptionPlan extends Document {
  state: "starter" | "pro" | "premium" | "enterprise";
  name: string;
  price: number;
  target: string;
  maxRestaurants: number;
  maxFloor: number | null;
  maxTables: number | null;
  maxMenu: number;
  features: string[];
  isMenuUploadViaExcel: boolean;
  isEccessSubUser: boolean;
  maxUsers: number;
  maxQRCodes: number;
  maxMenuItems: number;
  billingCycle: "monthly" | "yearly";
  isDeleted: boolean;
  mostPopular: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}