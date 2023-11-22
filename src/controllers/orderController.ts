import { getAll } from "./handleFactory";
import Order from "../models/orderModel";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import OrderDetails from "../models/orderDetailModel";

const getOrders = getAll(Order);

const createOrder = catchAsync(async (req: any, res: any, next: any) => {
  const doc = await Order.create({
    userId: req.user.id,
    status: req.body.status,
  });
  if (!doc) {
    return next(new AppError("No order could be created", 400));
  }

  delete req.body.status;

  req.body.orderIdGenerated = req.body.id; // the id of the request means in the orderId of paypal requested
  delete req.body.id;

  req.body.orderId = doc.id;
  //after assigning it as needed we delete it
  const orderDetailsDoc = await OrderDetails.create(req.body);

  if (!orderDetailsDoc) {
    return next(new AppError("Order Details error", 400));
  }

  res.status(200).json({
    doc: doc,
    message: "Order created",
  });
});

export default {
  createOrder,
  getOrders,
};
