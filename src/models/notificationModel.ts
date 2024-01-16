import mongoose, { Schema, model } from "mongoose";
import { IAppNotification } from "../interfaces/database/IAppNotification";
import AutoIncrement from "mongoose-auto-increment";
import { eRoles } from "../enums";

const appNotificationSchema = new Schema<IAppNotification>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    default: null,
  },
  customAction: {
    type: Object,
    required: false,
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
  role: {
    type: String,
    enum: [eRoles.User, eRoles.Admin, eRoles.Provider],
    default: eRoles.Admin,
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
