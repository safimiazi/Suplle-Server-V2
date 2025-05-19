import { userModel } from "./users.model";
import { IUser } from "./users.interface";
import AppError from "../../../errors/AppError";
import { uploadImgToCloudinary } from "../../../utils/sendImageToCloudinary";
import { validateData} from "../../../middlewares/validateData ";
import { usersUpdateValidation } from "./users.validation";
import { UpdateQuery } from "mongoose";


const createUser = async (data: IUser) => {
  const result = await userModel.create(data);
  return result;
};

const getAllUsers = async () => {
  return userModel.find({ isDeleted: false });
};

const getSingleUser = async (id: string) => {
  const result = await userModel.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(404, "User not found");
  }
  return result;
};

const updateUser = async (  id: string,
  data: any,
  file?: Express.Multer.File) => {

    const parsedData = JSON.parse(data);

    
    if (file && file.path) {
      const imageName = `${Math.floor(100 + Math.random() * 900)}`;
      const { secure_url } = await uploadImgToCloudinary(imageName, file.path) as {
        secure_url: string;
      };
      parsedData.image = secure_url;
    }


    const Data = await validateData(usersUpdateValidation, parsedData) as UpdateQuery<IUser>;

  const result = await userModel.findByIdAndUpdate(id, Data, { new: true });
  if (!result) {
    throw new AppError(404, "User not found");
  }
  return result;
};

const deleteUser = async (id: string) => {
  const result = await userModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(404, "User not found");
  }
  return result;
};

export const userService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
