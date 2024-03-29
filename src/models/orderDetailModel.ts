import mongoose, { Schema, model } from "mongoose";
import { IOrderDetails } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";

const OrderDetailsSchema = new Schema<IOrderDetails>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  orderId: {
    type: Number,
    ref: "Order",
    required: true,
  },
  orderIdGenerated: {
    type: String,
    required: true,
  },
  payer: {
    type: Object,
    required: true,
  },
  create_time: {
    type: Date,
    required: true,
  },
  intent: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  valuePaid: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});
AutoIncrement.initialize(mongoose.connection);

OrderDetailsSchema.plugin(AutoIncrement.plugin, {
  model: "OrderDetails",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const OrderDetails = model("OrderDetails", OrderDetailsSchema);

export default OrderDetails;
