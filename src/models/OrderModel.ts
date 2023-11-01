import mongoose, { Schema, model } from "mongoose";
import { IOrder } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";

const OrderSchema = new Schema<IOrder>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    userId: {
      type: Number,
      ref: "User",
      required: true,
    },
    mealId: {
      type: Number,
      ref: "Meal",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPaid: {
      type: Number,
    },
  },
  { timestamps: true }
);
AutoIncrement.initialize(mongoose.connection);

OrderSchema.plugin(AutoIncrement.plugin, {
  model: "Order",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Order = model("Order", OrderSchema);

export default Order;
