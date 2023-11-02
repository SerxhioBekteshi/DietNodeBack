import { catchAsync } from "../utils/catchAsync";
const stripe = require("../utils/config");

const approvePayment = catchAsync(async (req: any, res: any, next: any) => {
  const { amount, quantity, token } = req.body;
  stripe.charges
    .create({
      amount: amount * quantity, // Total amount to charge
      currency: "usd",
      source: token, // Token representing the credit card obtained from the client
      description: "Payment for products/services",
    })
    .then((charge: any) => {
      // Payment successful
      res
        .status(200)
        .json({ success: true, message: "Payment successful", charge });
    })
    .catch((error: any) => {
      // Handle payment failure
      res.status(500).json({ success: false, error: error.message });
    });
});

export default {
  approvePayment,
};
