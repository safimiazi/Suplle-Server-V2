import { io } from "../../server";
import { notificationModel } from "../modules/notification/notification.model"
import { adminSocket } from "./socket";

export const notifyAdmin = async (type: string, status: string, message: string, user: string) => {
    const notification = await notificationModel.create({ type, message, status, user });

    if (adminSocket) {
        io.to(adminSocket).emit('new-notification', notification);
    }
}