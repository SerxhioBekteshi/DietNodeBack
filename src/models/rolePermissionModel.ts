import mongoose, { Schema, model } from "mongoose";
import { IRolePermission } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";

const roldPermissionModel = new Schema<IRolePermission>({
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
  dateCreated: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: 0,
  },
});
AutoIncrement.initialize(mongoose.connection);

roldPermissionModel.plugin(AutoIncrement.plugin, {
  model: "MenuPermission",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const MenuPermission = model("MenuPermission", roldPermissionModel);

export default MenuPermission;
