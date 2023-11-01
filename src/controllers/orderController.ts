import { getAll } from "./handleFactory";
// import { AppError } from "../utils/appError";
import Order from "../models/OrderModel";

const getOrders = getAll(Order);

// const createQuizRow = async (req: any, res: any) => {
//   const doc = await Quiz.create(req.body);
//   res.status(200).json({ doc: doc, message: "Quiz done successfully" });
// };

export default {
  //   createQuizRow,
  getOrders,
};
