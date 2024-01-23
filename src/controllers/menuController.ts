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
  // const menuItems = await Menu.aggregate([
  //   {
  //     $facet: {
  //       $facet1: [
  //         {
  //           $lookup: {
  //             from: MenuPermission.collection.name,
  //             localField: "id",
  //             foreignField: "menuId",
  //             as: "menuPermission",
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: Permission.collection.name,
  //             localField: "menuPermission.permissionId",
  //             foreignField: "permission.id",
  //             as: "permission",
  //           },
  //         },
  //         {
  //           $match: {
  //             $and: [
  //               { "permission.isActive": true },
  //               { "permission.subjectId": null },
  //             ],
  //           },
  //         },
  //       ],
  //       $facet2: [
  //         {
  //           $lookup: {
  //             from: MenuPermission.collection.name,
  //             localField: "id",
  //             foreignField: "menuId",
  //             as: "menuPermission",
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: Permission.collection.name,
  //             localField: "menuPermission.permissionId",
  //             foreignField: "permission.id",
  //             as: "permission",
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: RolePermission.collection.name,
  //             localField: "menuPermission.permissionId",
  //             foreignField: "rolePermission.permissionId",
  //             as: "rolePermission",
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: Role.collection.name,
  //             localField: "rolePermission.roleId",
  //             foreignField: "role.id",
  //             as: "role",
  //           },
  //         },
  //         {
  //           $match: {
  //             $and: [
  //               { "permission.isActive": true },
  //               { "rolePermission.isActive": true },
  //               { "role.roleName": req.userRole },
  //               { "permission.subjectId": null },
  //               { "rolePermission.permissionId": { $nin: [] } },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $project: {
  //       unionResult: {
  //         $concatArrays: ["$facet1", "$facet2"],
  //       },
  //     },
  //   },
  // ]);
  const menuItems = await MenuPermission.aggregate([
    {
      $lookup: {
        from: Menu.collection.name,
        localField: "menuId",
        foreignField: "menu.id",
        as: "menu",
      },
    },
    {
      $lookup: {
        from: Permission.collection.name,
        localField: "menuPermission.permissionId",
        foreignField: "permission.id",
        as: "permission",
      },
    },
    {
      $lookup: {
        from: RolePermission.collection.name,
        localField: "menuPermission.permissionId",
        foreignField: "rolePermission.permissionId",
        as: "rolePermission",
      },
    },
    {
      $lookup: {
        from: Role.collection.name,
        localField: "rolePermission.roleId",
        foreignField: "role.id",
        as: "role",
      },
    },
    // {
    //   $match: {
    //     "permission.isActive": true,
    //     "rolePermission.isActive": true,
    //     "role.roleName": req.user.role,
    //     // "menu.parentId": null,
    //     "permission.subjectId": null,
    //     // "rolePermission.permissionId": { $nin: [] },
    //   },
    // },
    // {
    //   $project: {
    //     "menu.id": 1,
    //     "menu.label": 1,
    //     "menu.icon": 1,
    //     "menu.to": 1,
    //   },
    // },
  ]);

  console.log(menuItems, "MENU ITEMS");
  res.status(200).json(menuItems);
});

export default { getMenuItems, getMenuItemsNoRole, getMenuItems2 };
