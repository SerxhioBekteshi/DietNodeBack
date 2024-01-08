import mongoose, { Schema, model } from "mongoose";
import { IAppNotification } from "../interfaces/database/IAppNotification";
import AutoIncrement from "mongoose-auto-increment";

const appNotificationSchema = new Schema<IAppNotification>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  message: {
    type: Object,
    required: true,
  },
  route: {
    type: String,
    default: null,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  sender: {
    type: Number,
    ref: "User",
    required: true,
  },
  user: {
    type: Number,
    ref: "User",
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
