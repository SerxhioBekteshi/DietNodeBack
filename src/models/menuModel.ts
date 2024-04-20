import mongoose, { Schema, model } from "mongoose";
import { eRoles } from "../enums";
import { IMenu } from "../interfaces/database/IMenu";
import AutoIncrement from "mongoose-auto-increment";
import Permission from "./permissionModel";
import MenuPermission from "./menuPermissionsModel";

const menuSchema = new Schema<IMenu>({
  id: { type: Number, required: true, unique: true },
  label: { type: String, required: true, unique: true },
  icon: { type: String, default: "" },
  to: { type: String, default: "" },
  roleId: {
    type: Number,
    // required: true,
    // default: 1,
    ref: "Role",
  },
  collapisble: { type: Boolean, default: false },
  parentId: {
    type: Number,
    ref: "Menu",
    default: null,
  },
  // permissions: [{ type: Number, ref: Permission.collection.name }],
  // menuPermission: { type: Number, ref: MenuPermission.collection.name },
  shouldDisplay: { type: Boolean, default: true },
});

menuSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  await MenuPermission.deleteMany({ menuId: doc.id }).exec();
  await Permission.deleteMany({ subjectId: doc.id }).exec();
  next();
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
