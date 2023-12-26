import { deleteOne, getOne, updateOne } from "./handleFactory";
import { catchAsync } from "../utils/catchAsync";
import Permission from "../models/permissionModel";
import { AppError } from "../utils/appError";
import Menu from "../models/menuModel";
import MenuPermission from "../models/menuPermissionsModel";
import RolePermission from "../models/rolePermissionModel";
import Role from "../models/roleModel";

const getPermission = getOne(Permission);

const updatePermission = updateOne(Permission);

const deletePermission = deleteOne(Permission);

const createPermission = catchAsync(async (req: any, res: any) => {
  req.body.createdBy = req.user.id;
  const doc = await Permission.create(req.body);
  await createMenuPermission(req.body, doc);
  res.status(200).json({ doc: doc, message: "Created successfully" });
});

const createMenuPermission = (addPermissionData: any, permissionCreated: any) =>
  catchAsync(async (req: any, res: any, next: any) => {
    if (addPermissionData.subjectId !== null) {
      const menuItem = await Menu.findOne({ id: addPermissionData.subjectId });
      if (menuItem) {
        const checkRelationMenu = await MenuPermission.findOne({
          menuId: menuItem.id,
          permissionId: permissionCreated.id,
        });
        const menuPermissionBody = {
          menuId: menuItem.id,
          permissionId: permissionCreated.id,
        };
        if (checkRelationMenu) {
          await MenuPermission.updateOne(menuPermissionBody);
        } else {
          await MenuPermission.create(menuPermissionBody);
        }
      }
    }
  });

const createRolePermission = (addPermissionData: any, permissionCreated: any) =>
  catchAsync(async (req: any, res: any, next: any) => {
    const rolePermission = await RolePermission.findOne({
      id: permissionCreated.id,
    });
    if (rolePermission.length !== 0) {
      const roleIds = rolePermission.map((role: any) => role.id);
      await RolePermission.updateMany(
        { id: { $in: roleIds } },
        { $set: { isActive: 0 } }
      );
    }

    if (addPermissionData.roles.length !== 0) {
      addPermissionData.roles.forEach(async (role: any) => {
        const { id } = await Role.findOne({ roleName: role });
        const rolePermissionBody = {
          roleId: id,
          permissionId: permissionCreated.id,
        };

        const checkRelationRole = await RolePermission.findOne({
          roleId: id,
          permissionId: permissionCreated.id,
        });

        if (!checkRelationRole) {
          if (!checkRelationRole.isActive) {
            await RolePermission.updateOne({
              ...rolePermissionBody,
              isActive: true,
            });
          }
        } else {
          await RolePermission.create({
            ...rolePermissionBody,
            isActive: true,
          });
        }
      });
    }
  });

export default {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
};
