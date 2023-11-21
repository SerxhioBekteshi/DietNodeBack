import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import paypal from "@paypal/checkout-server-sdk";

// const paypal = require("@paypal/checkout-server-sdk");
const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    "AbHVdW0U-btSlkwDZC-Iewri7K64mNsK8NQgbSDxXlASer798EGfaqp0LNdyIII1KDxdi-xg02g525eT",
    "ECjaD_iTawgdSts5CVqk26p7xozcOx5YpZvorqAyJyo-JIRBpMFT6wwF28a7J-HlA6ITp04cl2uxTbjF"
  )
);

const approvePayment = catchAsync(async (req: any, res: any, next: any) => {
  const request = new paypal.orders.OrdersCreateRequest();
  const total = req.body.items.reduce((sum: number, item: any) => {
    return sum + item.price * item.quantity;
  }, 0);
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        description: "Test purposes",
        amount: {
          value: total,
          currency_code: "USD",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.body.items.map((item: any) => {
          return {
            name: item.name,
            unit_amount: {
              currency_code: "USD",
              value: item.price,
            },
            quantity: item.quantity,
          };
        }),
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
  } catch (e) {
    return next(new AppError("No order with that id created was found", 404));
  }
});

export default {
  approvePayment,
};
