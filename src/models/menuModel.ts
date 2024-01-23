import mongoose, { Schema, model } from "mongoose";
import { eRoles } from "../enums";
import { IMenu } from "../interfaces/database/IMenu";
import AutoIncrement from "mongoose-auto-increment";

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
  children: { type: Array<IMenu> },
  menuType: {
    type: String,
    enum: [eRoles.User, eRoles.Admin, eRoles.Provider],
    // default: eRoles.User,
  },
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
