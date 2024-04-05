import Menu from "../models/menuModel";
import MenuPermission from "../models/menuPermissionsModel";
import Permission from "../models/permissionModel";
import Role from "../models/roleModel";
import RolePermission from "../models/rolePermissionModel";
import { catchAsync } from "../utils/catchAsync";
import { getAll } from "./handleFactory";

const getMenuItems = catchAsync(async (req: any, res: any, next: any) => {
  const menuItems = await Menu.find({ roleId: req.roleId });
  res.status(200).json(menuItems);
});

const getMenuItemsNoRole = catchAsync(async (req: any, res: any, next: any) => {
  const menuItems = await Menu.find({ id: { $gt: 15 } });
  res.status(200).json(menuItems);
});

const getMenuItems2 = catchAsync(async (req: any, res: any, next: any) => {
  //ALSO WHEN I AM SETTING THE IS ACTIVE TO FALSE AFTER REMOVING THE PROVIDER WHY THE FUCK DOES NOT role.permission.isactive work?
  const menuItems = await Menu.aggregate([
    {
      $lookup: {
        from: MenuPermission.collection.name,
        localField: "id",
        foreignField: "menuId",
        as: "menuPermissions",
      },
    },
    { $unwind: "$menuPermissions" },
    {
      $lookup: {
        from: Permission.collection.name,
        localField: "menuPermissions.permissionId",
        foreignField: "id",
        as: "permission",
      },
    },
    { $unwind: "$permission" },
    {
      $lookup: {
        from: RolePermission.collection.name,
        localField: "menuPermissions.permissionId",
        foreignField: "permissionId",
        as: "rolePermissions",
      },
    },
    {
      $lookup: {
        from: Role.collection.name,
        localField: "rolePermissions.roleId",
        foreignField: "id",
        as: "role",
      },
    },
    { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },

    {
      $match: {
        "permission.isActive": true,
        "rolePermissions.isActive": true,
        "role.roleName": req.user.role,
        parentId: null,
        "permission.subjectId": null,
        id: { $gt: 15 },
      },
    },
    {
      $project: {
        label: 1,
        icon: 1,
        to: 1,
        id: 1,
        parentId: 1,
      },
    },
  ]);

  res.status(200).json(menuItems);
});

export default { getMenuItems, getMenuItemsNoRole, getMenuItems2 };
