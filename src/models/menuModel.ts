import mongoose, { Schema, model } from "mongoose";
import { eCategory, eRoles } from "../enums";
import { IMenu } from "../interfaces/database/IMenu";
import AutoIncrement from "mongoose-auto-increment";

const menuSchema = new Schema<IMenu>({
  id: { type: Number, required: true, unique: true },
  label: { type: String },
  icon: { type: String },
  to: { type: String },
  roleId: {
    type: Number,
    required: true,
    default: 1,
  },
  collapisble: { type: Boolean },
  children: { type: Array<IMenu> },
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
