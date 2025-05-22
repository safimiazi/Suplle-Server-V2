import { io } from "../../server";
import { notificationModel } from "../modules/notification/notification.model"
import { adminSocket } from "./socket";

export const notifyAdmin = async (type: string, message: string) => {
    const notification = await notificationModel.create({ type, message });

    if (adminSocket) {
        io.to(adminSocket).emit('new-notification', notification);
    }


}