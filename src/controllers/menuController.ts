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

const getMenuItems2 = catchAsync(async (req: any, res: any, next: any) => {
  // const subqueryResult = await MenuPermission.aggregate([
  //   {
  //     $match: {
  //       $and: [
  //         { "permission.IsActive": true },
  //         { "userPermission.IsActive": true },
  //         { "userPermission.UserId": req.user.id },
  //         { "permission.SubjectId": null },
  //       ],
  //     },
  //     $group: {
  //       id: null,
  //       permissionIds: { $addToSet: "$userPermission.PermissionId" },
  //     },
  //   },
  // ]); ->>> TO BE SEEEEEEN

  const menuItems = await Menu.aggregate([
    {
      $facet: {
        $facet1: [
          {
            $lookup: {
              from: MenuPermission.collection.name,
              localField: "id",
              foreignField: "menuId",
              as: "menuPermission",
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
            $match: {
              $and: [
                { "permission.isActive": true },
                // { "up.isActive": true },
                // { "up.userId": req.user.id },
                { "permission.subjectId": null },
              ],
            },
          },
        ],
        $facet2: [
          {
            $lookup: {
              from: MenuPermission.collection.name,
              localField: "id",
              foreignField: "menuId",
              as: "menuPermission",
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
          {
            $match: {
              $and: [
                { "permission.isActive": true },
                { "rolePermission.isActive": true },
                { "role.roleName": req.userRole },
                { "permission.subjectId": null },
                { "rolePermission.permissionId": { $nin: [] } }, // Fill in the array with the subquery result, this should be the result of the first
                //subquery with the exception of SELECT up.permissionId, so just select the IDS
              ],
            },
          },
        ],
      },
    },
    {
      $project: {
        unionResult: {
          $concatArrays: ["$facet1", "$facet2"],
        },
      },
    },
  ]);
  res.status(200).json(menuItems);
});

export default { getMenuItems, getMenuItems2 };
