// import { Server } from "http";
// import app from "./app";
// import mongoose from "mongoose";
// import config from "./app/config";

// let server: Server;
// async function startServer() {
//   try {
//     await mongoose.connect(config.DATABASE_URL as string);
//     server = app.listen(config.BACKEND_PORT, () => {
//       console.log(`Server is running on port ${config.BACKEND_PORT}`);
//       console.log(`Database connected successfully`);
//     });
//   } catch (error) {
//     console.error("Error starting server:", error);
//   }
// }

// startServer();

// process.on("unhandledRejection", (error) => {
//   console.log(`😈 unahandledRejection is detected , shutting down ...`, error);
//   if (server) {
//     server.close(() => {
//       console.log(`😈 server is closed`);
//       process.exit(1);
//     });
//   }
// });

// process.on("uncaughtException", (err) => {
//   console.log(`😈 uncaughtException is detected , shutting down ...`, err);

//   process.exit(1);
// });


// server.ts
import http from "http";
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { Server  as SocketIOServer} from "socket.io";
import { setupSocket } from "./app/utils/socket";

let server: http.Server;
let io : SocketIOServer
async function startServer() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    console.log("✅ Database connected");

    server = http.createServer(app);
     io = new SocketIOServer(server, {
      cors: { origin: "*" },
    });

    // Initialize socket logic
    setupSocket(io);

    server.listen(config.BACKEND_PORT, () => {
      console.log(`🚀 Server running on port ${config.BACKEND_PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
}

startServer();

// Error handlers
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection. Shutting down...", err);
  if (server) {
    server.close(() => process.exit(1));
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception. Shutting down...", err);
  process.exit(1);
});

export {io}