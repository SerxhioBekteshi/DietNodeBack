import mongoose, { Schema, model } from "mongoose";
import { IAppNotification } from "../interfaces/database/IAppNotification";
import AutoIncrement from "mongoose-auto-increment";

const appNotificationSchema = new Schema<IAppNotification>({
  message: {
    type: Object,
    required: true,
  },
  route: {
    type: String,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AutoIncrement.initialize(mongoose.connection);

appNotificationSchema.plugin(AutoIncrement.plugin, {
  model: "AppNotification",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const AppNotification = model<IAppNotification>(
  "AppNotification",
  appNotificationSchema
);

export default AppNotification;
