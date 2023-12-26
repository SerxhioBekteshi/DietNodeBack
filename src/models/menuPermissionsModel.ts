import mongoose, { Schema, model } from "mongoose";
import { IMenuPermission } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";

const menuPermissionsSchema = new Schema<IMenuPermission>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    menuId: {
      type: Number,
      ref: "Menu",
      required: true,
    },
    permissionId: {
      type: Number,
      ref: "Permission",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
AutoIncrement.initialize(mongoose.connection);

menuPermissionsSchema.plugin(AutoIncrement.plugin, {
  model: "MenuPermission",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const MenuPermission = model("MenuPermission", menuPermissionsSchema);

export default MenuPermission;
