import mongoose, { Schema, model } from "mongoose";
import { IMenu, IRole } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";

const roleSchema = new Schema<IRole>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  roleName: {
    type: String,
    required: true,
  },
});
AutoIncrement.initialize(mongoose.connection);

roleSchema.plugin(AutoIncrement.plugin, {
  model: "Role",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Role = model("Role", roleSchema);

export default Role;
