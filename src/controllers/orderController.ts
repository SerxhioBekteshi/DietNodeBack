import { getAll } from "./handleFactory";
import Order from "../models/orderModel";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import OrderDetails from "../models/orderDetailModel";
import { eRoles } from "../enums";
import socketManager from "../../socket";
import Meal from "../models/mealModel";
import {
  convertArrayToObjectStructure,
  convertToObjectStructure,
} from "../utils";

const getOrders = getAll(Order);

const createOrder = catchAsync(async (req: any, res: any, next: any) => {
  const doc = await Order.create({
    userId: req.user.id,
    status: req.body.status,
    meals: req.body.mealIds,
  });
  if (!doc) {
    return next(new AppError("No order could be created", 400));
  }

  delete req.body.status;

  req.body.orderIdGenerated = req.body.id; // the id of the request means in the orderId of paypal requested
  delete req.body.id;

  req.body.orderId = doc.id;
  req.body.link = req.body.links[0].href;
  delete req.body.links[0];

  req.body.items = req.body.purchase_units[0].items;

  req.body.description = req.body.purchase_units[0].description;
  req.body.currency = req.body.purchase_units[0].amount.currency_code;
  req.body.valuePaid = req.body.purchase_units[0].amount.value;
  req.body.address = req.body.purchase_units[0].shipping.address.address_line_1;

  delete req.body.purchase_units[0];

  const orderDetailsDoc = await OrderDetails.create(req.body);

  req.body.mealIds.forEach(async (meal: number) => {
    const mealOfProvider = await Meal.findOne({ id: meal });

    if (mealOfProvider) {
      socketManager.sendNotificationProvider(
        "A new order was made",
        mealOfProvider.providerId,
        req.user.id,
        "New order",
        `/orders/${orderDetailsDoc.id}`,
        eRoles.Provider
      );
    }
  });

  socketManager.sendAppNotificationToAdmin(
    "A new order was made",
    1,
    req.user.id,
    "New order",
    `/orders/${orderDetailsDoc.id}`,
    eRoles.Admin
  );

  if (!orderDetailsDoc) {
    return next(new AppError("Order Details error", 400));
  }

  res.status(200).json({
    doc: doc,
    message: "Order created",
  });
});

const getOrderDetailsByOrder = catchAsync(
  async (req: any, res: any, next: any) => {
    const orderDetail = await OrderDetails.findOne({
      orderId: req.params.id,
    }).exec();
    (orderDetail.valuePaid =
      `${orderDetail.valuePaid}` + ` ${orderDetail.currency}`),
      (orderDetail.payer = convertToObjectStructure(orderDetail.payer));
    // (orderDetail.items = convertArrayToObjectStructure(orderDetail.items));
    res.status(200).json(orderDetail);
  }
);

export default {
  createOrder,
  getOrders,
  getOrderDetailsByOrder,
};
