import mongoose, { Schema, model } from "mongoose";
import { IRolePermission } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";

const roldPermissionModel = new Schema<IRolePermission>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    roleId: {
      type: Number,
      ref: "Role",
      required: true,
    },
    permissionId: {
      type: Number,
      ref: "Permission",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
AutoIncrement.initialize(mongoose.connection);

roldPermissionModel.plugin(AutoIncrement.plugin, {
  model: "RolePermission",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const RolePermission = model("RolePermission", roldPermissionModel);

export default RolePermission;
