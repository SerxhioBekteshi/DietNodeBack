import { Server } from "socket.io";
import http from "http";
import https from "https";
import AppNotification from "./src/models/notificationModel";
import User from "./src/models/userModel";
// import { readComments } from './src/controllers/timeOffController';
import { eRoles, eSocketEvent } from "./src/enums";
let io: Server = null;

const initialize = (
  server:
    | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
    | https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:8080", // TODO: configure enviroment client url
    },
    transports: ["websocket", "polling"],
  });
  io.on("connection", (socket) => {
    console.log("> New client connected with id = ", socket.id);

    socket.join(userRoomName(socket.handshake.query.userId));
    socket.join(adminRoomName(socket.handshake.query.adminId));

    socket.on(eSocketEvent.Disconnect, function (reason) {
      console.log("> A client disconnected with id = ", socket.id);
      console.log("> Reason: ", reason);
    });
    socket.on(eSocketEvent.JoinRoom, (arg) => {
      console.log(
        ">Client with id = ",
        socket.id,
        " connected to timeoff with id = ",
        arg.timeOffId
      );
      // socket.join(timeOffRoomName(arg.timeOffId));
    });
    socket.on(eSocketEvent.LeaveRoom, (arg) => {
      console.log(
        ">Client with id = ",
        socket.id,
        " disconnected from timeoff with id = ",
        arg.timeOffId
      );
      // socket.leave(timeOffRoomName(arg.timeOffId));
    });

    socket.on(eSocketEvent.ReadComments, (arg) => {
      // readComments(arg.timeOffId, arg.ids);
    });
  });
};

const getInstance = () => io;

// const sendAppNotificationToClient = (
//   userId: any,
//   message: any,
//   customer: any,
//   sender: any,
//   route?: string
// ) => {
//   AppNotification.create({
//     message,
//     customer,
//     route,
//     user: userId,
//     sender,
//   }).then((val) => {
//     User.findById(val.sender).then((user) => {
//       io.to(adminRoomName(userId)).emit("AppNotification", {
//         ...val.toJSON(),
//         sender: user.toJSON(),
//       });
//     });
//   });
// };

const sendAppNotificationToAdmin = (
  message: any,
  receiver: number,
  sender: number,
  title: string,
  route?: string,
  role?: eRoles,
  customAction?: any
) => {
  AppNotification.create({
    message,
    receiver,
    sender,
    title,
    route,
    role,
    customAction,
  }).then((val) => {
    User.findOne({ role: role }).then((user) => {
      io.to(adminRoomName(user.id)).emit("AppNotification", {
        ...val.toJSON(),
      });
    });
  });
};

const sendNotificationProvider = (
  message: any,
  receiver: number,
  sender: number,
  title: string,
  route?: string,
  role?: eRoles,
  customAction?: any
) => {
  AppNotification.create({
    message,
    receiver,
    sender,
    title,
    route,
    role,
    customAction,
  }).then((val) => {
    io.to(userRoomName(receiver)).emit("AppNotification", {
      ...val.toJSON(),
    });
  });
};

// const sendNotificationToAdmin = (adminId: any, notification: any) => {
//   // User.findById(adminId).then((adminUser: any) => {
//   // if (adminUser && adminUser.role === 'admin') {
//   // }
//   // })

//   console.log("KETU DUHET TE BEHET EMIT??");
//   io.to(adminRoomName(adminId)).emit("AppNotification", notification);
// };

const sendMessageToClient = (
  userId: any,
  messageName: string,
  message: any
) => {
  io.to(userRoomName(userId)).emit(messageName, message);
};

const userRoomName = (userId: any) => {
  return `User_${userId}`;
};

const adminRoomName = (adminId: any) => {
  return `Admin_${adminId}`;
};

export default {
  initialize,
  getInstance,
  sendMessageToClient,
  sendNotificationProvider,
  // sendMessageToCustomer,
  // sendAppNotificationToClient,
  sendAppNotificationToAdmin,
  // sendNotificationToAdmin,
  // sendMessageToTimeOff,
};
