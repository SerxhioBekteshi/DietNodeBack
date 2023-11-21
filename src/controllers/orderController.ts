import { getAll } from "./handleFactory";
// import { AppError } from "../utils/appError";
import Order from "../models/OrderModel";
import { catchAsync } from "../utils/catchAsync";

const getOrders = getAll(Order);

const createOrder = catchAsync((req: any, res: any) => {
  req.body.orderIdGenerated = req.body.id;
  delete req.body.id;

  req.body.paypalAccount = req.body.payer;
  delete req.body.payer;
});

export default {
  createOrder,
  getOrders,
};
