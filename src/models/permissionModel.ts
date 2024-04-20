import mongoose, { Schema, model } from "mongoose";
import { IPermission } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";
import RolePermission from "./rolePermissionModel";
import MenuPermission from "./menuPermissionsModel";

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
    // rolePermissions: [{ type: Number, ref: RolePermission.collection.name }],
    // menuPermissions: [{ type: Number, ref: MenuPermission.collection.name }],
  },
  { timestamps: true }
);
AutoIncrement.initialize(mongoose.connection);

PermissionsSchema.pre("findOneAndDelete", async function (next) {
  // const parent = this;
  // console.log("here????");
  const doc = await this.model.findOne(this.getFilter());
  // Remove all child documents with the parent's id
  await RolePermission.deleteMany({ permissionId: doc.id }).exec();
  await MenuPermission.deleteMany({ permissionId: doc.id }).exec();

  next();
});

PermissionsSchema.plugin(AutoIncrement.plugin, {
  model: "Permission",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Permission = model("Permission", PermissionsSchema);

export default Permission;
