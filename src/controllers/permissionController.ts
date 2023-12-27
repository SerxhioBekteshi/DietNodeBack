import { deleteOne, getOne, updateOne } from "./handleFactory";
import { catchAsync } from "../utils/catchAsync";
import Permission from "../models/permissionModel";
import { AppError } from "../utils/appError";
import Menu from "../models/menuModel";
import MenuPermission from "../models/menuPermissionsModel";
import RolePermission from "../models/rolePermissionModel";
import Role from "../models/roleModel";

const getPermission = catchAsync(async (req: any, res: any, next: any) => {
  const listRoles: String[] = [];
  const existingPermission = await Permission.findOne({ id: req.params.id });

  console.log(existingPermission, "EXISTING PERMISSION ");
  const roleIds = await RolePermission.find({ roleId: existingPermission.id });
  console.log(roleIds);
  roleIds.forEach(async (roleId: any) => {
    const roleName = await Role.findOne({ id: roleId }).select("roleName");
    listRoles.push(roleName);
  });

  existingPermission.roles = listRoles;
  console.log(listRoles, existingPermission, "CHECKS IN THE END");

  res.status(200).json({ permission: existingPermission });
});

const updatePermission = updateOne(Permission);

const deletePermission = deleteOne(Permission);

const createPermission = catchAsync(async (req: any, res: any, next: any) => {
  req.body.createdBy = req.user.id;
  const doc = await Permission.create(req.body);
  createMenuPermission(req.body, doc, next);
  createRolePermission(req.body, doc, next);
  res.status(200).json({ doc: doc, message: "Created successfully" });
});

const createMenuPermission = async (
  addPermissionData: any,
  permissionCreated: any,
  next: any
) => {
  try {
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
          await MenuPermission.updateOne(checkRelationMenu, menuPermissionBody);
        } else {
          await MenuPermission.create(menuPermissionBody);
        }
      }
    }
  } catch (err: any) {
    console.log(err, "IN CREATE PERMISSION");
    return next(new AppError(err, 500));
  }
};

const createRolePermission = async (
  addPermissionData: any,
  permissionCreated: any,
  next: any
) => {
  const rolePermissions = await RolePermission.find({
    permissionId: permissionCreated.id,
  });

  try {
    if (rolePermissions.length !== 0) {
      const roleIds = rolePermissions.map((role: any) => role.id);
      await RolePermission.updateMany(
        { id: { $in: roleIds } },
        { $set: { isActive: 0 } }
      );
    }

    if (addPermissionData.roles.length !== 0) {
      addPermissionData.roles.forEach(async (role: any) => {
        const { roleId } = await Role.findOne({ roleName: role });

        const rolePermissionBody = {
          roleId: roleId,
          permissionId: permissionCreated.id,
        };

        const checkRelationRole = await RolePermission.findOne({
          roleId: roleId,
          permissionId: permissionCreated.id,
        });

        if (checkRelationRole) {
          if (!checkRelationRole.isActive) {
            await RolePermission.updateOne(checkRelationRole, {
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
  } catch (err: any) {
    console.log(err, "IN CREATE PERMISSION");
    return next(new AppError(err, 500));
  }
};

export default {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
};
