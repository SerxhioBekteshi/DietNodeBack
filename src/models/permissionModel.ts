import mongoose, { Schema, model } from "mongoose";
import { IPermission } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";

const PermissionsSchema = new Schema<IPermission>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
    },
    menuId: {
      type: Number,
      ref: "Menu",
      default: null,
    },
    createdBy: {
      type: Number,
      ref: "User",
    },
  },
  { timestamps: true }
);
AutoIncrement.initialize(mongoose.connection);

PermissionsSchema.plugin(AutoIncrement.plugin, {
  model: "Permission",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Permission = model("Permission", PermissionsSchema);

export default Permission;
