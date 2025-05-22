// socket.ts
import { Server } from "socket.io";

let adminSocket: string | null = null;

export const setupSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log("Someone connected:", socket.id)

        socket.on("register-admin", () => {
            adminSocket = socket.id;
            console.log("Admin registered:", socket.id);
        });

        socket.on("disconnect", () => {
            if (socket.id === adminSocket) {
                adminSocket = null;
                console.log("Admin disconnected");
            }
        });
    });
};

export { adminSocket };
