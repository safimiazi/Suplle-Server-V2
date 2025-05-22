import { adminSocket, io } from "../../app";
import { notificationModel } from "../modules/notification/notification.model"

export const notifyAdmin = async (type: string, message: string) => {
    const notification = await notificationModel.create({ type, message });

    if (adminSocket) {
        io.to(adminSocket).emit('new-notification', notification);
    }


}