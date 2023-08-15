import mongoose, { Schema, model } from "mongoose";
import { IMenu, IRole } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";

const roleSchema = new Schema<IRole>({
  //we create the user schema
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  roleName: {
    type: String,
    required: true,
  },
  //   menuItems: [
  //     {
  //       type: IMenu,
  //       ref: "Menu",
  //     },
  //   ],
});
AutoIncrement.initialize(mongoose.connection);

roleSchema.plugin(AutoIncrement.plugin, {
  model: "Role",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

// Initialize roles
roleSchema.statics.initializeRoles = function () {
  const Role = mongoose.model("Role");
  const roles = [
    { id: 1, roleName: "admin" },
    { id: 2, roleName: "provider" },
    { id: 3, roleName: "user" },
  ];

  return Role.insertMany(roles);
};

const Role = model("Role", roleSchema);

export default Role;
