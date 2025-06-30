import AppError from "../errors/AppError";
import { UserModel } from "../modules/users/user/users.model";


export const getSelectedRestaurantId = async (userId: string): Promise<string> => {
    const user = await UserModel.findById(userId).select('selectedRestaurant');

    if (!user || !user.selectedRestaurant) {
        throw new AppError(404, 'Selected restaurant not found for the user');
    }

    return user.selectedRestaurant.toString();
};