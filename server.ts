import dotenv from "dotenv";
import http from "http";
import express from "./src/app";
import socket from "./socket";
import database from "./database";
import {
  //   initializeAdmin,
  initializeMenuItems,
  //   initializeRoles,
} from "./src/utils";

const main = async () => {
  dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
  });
  // this handler MUST stay at top
  process.on("uncaughtException", (err) => {
    console.log("UNHALDED EXCEPTION!");
    console.log(err.name, err.message);
    console.log(err);
    // shut down application
    //process.exit(1);
  });

  const port = process.env.PORT;

  await database.initialize();

  const server = http.createServer(express); // TODO: configure also for https based on enviroment

  socket.initialize(server);

  server.listen(port, () => {
    console.log(`App running on port ${port} ....`);
    // initializeRoles();
    // initializeAdmin();
    initializeMenuItems();
  });
  process.on("unhandledRejection", (err: any) => {
    console.log(err.name, err.message);
    console.log(err);
    // console.log('UNHALDED REJECTION! Server is shuting down...');
    // server.close(() => {
    //   // shut down application
    //   //process.exit(1);
    // });
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM RECIVED. Shutting down gracefully");
    // server.close(() => {
    //   console.log('Process terminated!');
    // });
  });
};
main();
