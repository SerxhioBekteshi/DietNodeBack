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
    subjectId: {
      type: Number,
      ref: "Menu",
      default: null,
    },
    action: {
      type: String,
    },
    createdBy: {
      type: Number,
      ref: "User",
    },
    // rolePermissions: [{ type: Schema.Types.ObjectId, ref: "RolePermission" }],
    // menuPermissions: [{ type: Schema.Types.ObjectId, ref: "MenuPermission" }],
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
