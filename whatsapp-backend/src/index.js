import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";

import app from "./app.js";
import logger from "./configs/logger.config.js"
import SocketServer from "./SocketServer.js";

// dotenv config for access .env
dotenv.config()

// env variables
const {DATABASE_URL} = process.env

// env variable
const PORT = process.env.PORT || 8000;

//exit on mongodb error
mongoose.connection.on('error',(err)=>{ 
  logger.error("mongodb connection error: ",err);
  process.exit(1); // stop server
})

//mongodb debug mode for complex query 
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

// mongodb connection
mongoose.connect(DATABASE_URL).then(()=>{ 
  logger.info("Connect to mongodb")
})

let server;

server= app.listen(PORT,()=>{ 
  logger.info(`server listening on port http://localhost:${PORT}`);
})

// socket io
const io = new Server(server,{
  pingTimeout: 60000, //যদি ক্লায়েন্ট 60 সেকেন্ড (60000 মিলিসেকেন্ড) এর মধ্যে সার্ভারে পিং না পাঠায়, তাহলে কানেকশন ডিসকানেক্ট হয়ে যাবে।
  cors:{
    origin:process.env.CLIENT_ENDPOINT
  }
});

io.on("connection", (socket) => {
  logger.info("socket io connected successfully.");
   SocketServer(socket, io);

});

// handle server error
const exitHandler = ()=>{ 

  if(server){ 
    logger.info("server closed")
    process.exit(1)
  }else{ 
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};
// process.on("uncaughtException", unexpectedErrorHandler);
// process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});