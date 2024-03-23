import mongoose, { Schema, model } from "mongoose";
import { IOrder } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";
import { eOrderStatus } from "../enums";

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
    meals: [{ type: Number, ref: "Meal" }],
    status: {
      type: String,
      enum: [
        eOrderStatus.Completed,
        eOrderStatus.Rejected,
        eOrderStatus.Pending,
      ],
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
