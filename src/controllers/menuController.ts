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
  const menuItems = await Menu.aggregate([
    {
      $lookup: {
        from: MenuPermission.collection.name,
        localField: "id",
        foreignField: "menuId",
        as: "mp",
      },
    },
    {
      $unwind: "$mp",
    },
    {
      $lookup: {
        from: Permission.collection.name,
        localField: "mp.permissionId",
        foreignField: "id",
        as: "permission",
      },
    },
    {
      $unwind: "$permission",
    },
    {
      $lookup: {
        from: RolePermission.collection.name,
        localField: "mp.permissionId",
        foreignField: "permisionId",
        as: "rp",
      },
    },
    {
      $lookup: {
        from: Role.collection.name,
        localField: "rp.roleId",
        foreignField: "id",
        as: "role",
      },
    },
    {
      $unwind: {
        path: "$role",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "permission.isActive": true,
        "rp.isActive": true,
        "role.roleName": req.user.role,
        parentId: null,
        // "permission.subjectId": null,
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

  console.log(menuItems, "MENU ITEMS");
  res.status(200).json(menuItems);
});

export default { getMenuItems, getMenuItemsNoRole, getMenuItems2 };
