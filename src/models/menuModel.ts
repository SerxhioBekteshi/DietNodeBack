import mongoose, { Schema, model } from "mongoose";
import { eRoles } from "../enums";
import { IMenu } from "../interfaces/database/IMenu";
import AutoIncrement from "mongoose-auto-increment";
import Permission from "./permissionModel";
import MenuPermission from "./menuPermissionsModel";

const menuSchema = new Schema<IMenu>({
  id: { type: Number, required: true, unique: true },
  label: { type: String, required: true },
  icon: { type: String, required: true },
  to: { type: String, required: true },
  roleId: {
    type: Number,
    // required: true,
    // default: 1,
    ref: "Role",
  },
  collapisble: { type: Boolean },
  parentId: {
    type: Number,
    ref: "Menu",
    default: null,
  },
  permissions: [{ type: Number, ref: Permission.collection.name }],
  menuPermission: { type: Number, ref: MenuPermission.collection.name },
});

AutoIncrement.initialize(mongoose.connection);

menuSchema.plugin(AutoIncrement.plugin, {
  model: "Menu",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Menu = model("Menu", menuSchema);

export default Menu;
