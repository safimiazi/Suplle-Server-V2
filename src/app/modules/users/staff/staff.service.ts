import { StaffModel } from "./staff.model";
import { IStaff } from "./staff.interface";
import AppError from "../../../errors/AppError";
import { uploadImgToCloudinary } from "../../../utils/sendImageToCloudinary";
import { userModel } from "../user/users.model";
import mongoose, { startSession } from "mongoose";
import bcrypt from "bcryptjs";
import { validateData } from "../../../middlewares/validateData ";
import { staffPostValidation, staffUpdateValidation } from "./staff.validation";


const createStaff = async (data: any, file: Express.Multer.File) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { image, ...rest } = data;
    const staffData: any = { ...rest };
    if (file && file.path) {
      const imageName = `${Math.floor(100 + Math.random() * 900)}`;
      const { secure_url } = await uploadImgToCloudinary(imageName, file.path) as {
        secure_url: string;
      };
      staffData.image = secure_url;
    } else {
      staffData.image = "no image";
    }
    
    const hashedPassword = await bcrypt.hash("staff123", 10);
    // Create user
    const userData = {
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      password: hashedPassword,
      role: staffData.role,
      image: staffData.image,
    };

    const createUser = await userModel.create([userData], { session });
  
    
    // Prepare staff data
    const staffDoc = {
      user: createUser[0]._id,
      restaurant: staffData.restaurant,
      workDay: staffData.workDay,
      workTime: staffData.workTime,

    };
  
      // const validatedData = await validateData<IStaff>(staffPostValidation, staffDoc);

    const createdStaff = await StaffModel.create([staffDoc], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return createdStaff[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(500, "Failed to create staff: " + (error as Error).message);
  }
};
const getAllStaff = async () => {
  const result = await StaffModel.find({ isDeleted: false }).populate("user").populate("restaurant");
  return result;
};

const getSingleStaff = async (id: string) => {
  const result = await StaffModel.findById(id).populate("user").populate("restaurant");
  if (!result || result.isDeleted) {
    throw new AppError(404, "Staff not found");
  }
  return result;
};

const updateStaff = async (
  id: string,
  data: any,
  file?: Express.Multer.File
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    let imageUrl = data.image || "no image";

    // If a new image is uploaded
    if (file && file.path) {
      const imageName = `${Math.floor(100 + Math.random() * 900)}`;
      const { secure_url } = await uploadImgToCloudinary(imageName, file.path) as {
        secure_url: string;
      };
      imageUrl = secure_url;
    }


   const userData = {
    name:data.name,
    email:data.email,
    phone:data.phone
   }
   const  staffData =  await StaffModel.findOne({_id:id});
    if (!staffData) {
      throw new AppError(404, "Staff not found");
    }
    // Update the user
    const updatedUser = await userModel.findByIdAndUpdate(
      staffData.user,
       userData,
      { new: true, session }
    );

    if (!updatedUser) {
      throw new AppError(404, "User not found");
    }
    const validatedData = await validateData<IStaff>(staffUpdateValidation.unwrap(), data);

    const updatedStaff = await StaffModel.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, session }
    );

    if (!updatedStaff) {
      throw new AppError(404, "Staff not found");
    }

    await session.commitTransaction();
    session.endSession();

    return updatedStaff;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(500, "Failed to update staff: " + (error as Error).message);
  }
};

const deleteStaff = async (id: string) => {
  const result = await StaffModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!result) {
    throw new AppError(404, "Staff not found");
  }
  return result;
};

export const staffService = {
  createStaff,
  getAllStaff,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};
