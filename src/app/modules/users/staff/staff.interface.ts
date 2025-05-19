import { Types } from "mongoose";
export type IstaffRole = 'active' | 'inactive'

export type IStaff = {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;
  workDay: string;
  workTime: string;
  status:  IstaffRole ;
  isDeleted: boolean;
};
