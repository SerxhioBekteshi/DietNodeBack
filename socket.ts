import { Server } from "socket.io";
import http from "http";
import https from "https";
import AppNotification from "./src/models/notificationModel";
import User from "./src/models/userModel";
// import { readComments } from './src/controllers/timeOffController';
import { eSocketEvent } from "./src/enums";
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

    // socket.join(customerRoomName(socket.handshake.query.customerId));

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

const sendNotificationToAdmin = (adminId: any, notification: any) => {
  // User.findById(adminId).then((adminUser: any) => {
  // if (adminUser && adminUser.role === 'admin') {
  // }
  // })

  io.to(adminRoomName(adminId)).emit("AppNotification", notification);
};

const sendMessageToClient = (
  userId: any,
  messageName: string,
  message: any
) => {
  io.to(userRoomName(userId)).emit(messageName, message);
};

const sendMessageToAdmin = (
  adminId: any,
  messageName: string,
  message: any
) => {
  io.to(adminRoomName(adminId)).emit(messageName, message);
};

// function sendMessageToTimeOff(
//   timeOffId: any,
//   messageName: string,
//   message?: any
// ) {
//   io.to(timeOffRoomName(timeOffId)).emit(messageName, message);
// }
// const sendMessageToCustomer = (
//   customerId: any,
//   messageName: string,
//   message: any
// ) => {
//   io.to(customerRoomName(customerId)).emit(messageName, message);
// };
const customerRoomName = (customerId: any) => {
  return `Customer_${customerId}`;
};
const userRoomName = (userId: any) => {
  return `User_${userId}`;
};
const timeOffRoomName = (timeOffId: any) => {
  return `Time_Off_${timeOffId}`;
};

const adminRoomName = (adminId: any) => {
  return `Admin_${adminId}`;
};

function sendTableUpdatedMessage(timeOffId, controllerName: eSocketEvent) {
  io.to(timeOffRoomName(timeOffId)).emit(controllerName);
}

export default {
  initialize,
  getInstance,
  sendMessageToClient,
  sendMessageToAdmin,
  // sendMessageToCustomer,
  // sendAppNotificationToClient,
  sendNotificationToAdmin,
  // sendMessageToTimeOff,
};
