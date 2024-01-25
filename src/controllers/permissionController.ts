import { deleteOne, getOne, updateOne } from "./handleFactory";
import { catchAsync } from "../utils/catchAsync";
import Permission from "../models/permissionModel";
import { AppError } from "../utils/appError";
import Menu from "../models/menuModel";
import MenuPermission from "../models/menuPermissionsModel";
import RolePermission from "../models/rolePermissionModel";
import Role from "../models/roleModel";
import { isObjEmpty } from "../utils";

const getPermission = catchAsync(async (req: any, res: any, next: any) => {
  const listRoles: String[] = [];
  const existingPermission = await Permission.findOne({
    id: req.params.id,
  }).lean();

  if (!existingPermission) {
    return next(new AppError("No doc permission find with that id", 404));
  }
  const roles = await RolePermission.find({
    permissionId: existingPermission.id,
  });

  if (!roles) {
    return next(new AppError("No roles for this permission were found", 404));
  }

  // roles.forEach(async (role: any) => {
  for (const role of roles) {
    if (role.isActive) {
      const destructedRole = await Role.findOne({ id: role.roleId });
      listRoles.push(destructedRole.roleName);
    }
  }
  existingPermission["roles"] = listRoles;

  res.status(200).json(existingPermission);
});

const updatePermission = catchAsync(async (req: any, res: any, next: any) => {
  if (isObjEmpty(req.body)) {
    return next(new AppError("There are no data for updating the doc.", 400));
  }
  const doc = await Permission.findOneAndUpdate(
    { id: req.params.id },
    req.body
  );

  if (!doc) {
    return next(new AppError("No doc find with that id", 404));
  }
  createMenuPermission(req.body, doc, next);
  createRolePermission(req.body, doc, next);
  res.status(200).json({ doc: doc, message: "Updated successfully" });
});

const deletePermission = catchAsync(async (req: any, res: any, next: any) => {
  console.log(req.params.id, "PARAMS ID");
  const query = await Permission.findOneAndDelete({ id: req.params.id });
  if (!query) {
    return next(new AppError("No doc find with that id", 404));
  }

  console.log(query, "QUERY");
  if (query) {
    const rolePermissions = await RolePermission.deleteMany({
      permissionId: req.params.id,
    });

    const menuPermissions = await MenuPermission.deleteMany({
      permissionId: req.params.id,
    });
  }

  // if (!rolePermissions) {
  //   return next(
  //     new AppError("No role permissions could be deleted, not found!", 404)
  //   );
  // }

  // if(!menuPermissions){
  //   return next(
  //     new AppError("No menu permissions could be deleted, not found!", 404)
  //   );
  // }
  // }

  res.status(200).json("Delete successfully");
});

const createPermission = catchAsync(async (req: any, res: any, next: any) => {
  req.body.createdBy = req.user.id;
  const doc = await Permission.create(req.body);
  createMenuPermission(req.body, doc, next);
  createRolePermission(req.body, doc, next);
  res.status(200).json({ doc: doc, message: "Created successfully" });
});

const createMenuPermission = async (
  permissionPayload: any,
  permissionRow: any,
  next: any
) => {
  try {
    //we are supposing subjet Id can not be modifed for the certain permission row for the moment
    // if (permissionPayload.subjectId !== null) {
    //   const menuItem = await Menu.findOne({
    //     id: permissionPayload.subjectId,
    //   });
    //   if (menuItem) {
    //     const checkRelationMenu = await MenuPermission.findOne({
    //       menuId: menuItem.id,
    //       permissionId: permissionRow.id,
    //     });
    //     const menuPermissionBody = {
    //       menuId: menuItem.id,
    //       permissionId: permissionRow.id,
    //     };
    //     if (checkRelationMenu) {
    //       await MenuPermission.updateOne(checkRelationMenu, menuPermissionBody);
    //     } else {
    //       await MenuPermission.create(menuPermissionBody);
    //     }
    //   } else {
    //     return next(new AppError("No menu item was found with that id", 404));
    //   }
    // }
    if (permissionPayload.subjectId === null) {
      const menuItem = await Menu.findOne({ label: permissionPayload.name });

      if (menuItem) {
        const menuPermission = await MenuPermission.findOne({
          menuId: menuItem.id,
        });

        if (!menuPermission) {
          const menuPermissionBody = {
            menuId: menuItem.id,
            permissionId: permissionRow.id,
          };
          await MenuPermission.create(menuPermissionBody);
        }
      }
    }
  } catch (err: any) {
    console.log(err, "In create Menu Permission");
    return next(new AppError(err, 500));
  }
};

const createRolePermission = async (
  permissionPayload: any,
  permissionRow: any,
  next: any,
  mode?: string
) => {
  const rolePermissions = await RolePermission.find({
    permissionId: permissionRow.id,
  });

  try {
    if (rolePermissions.length !== 0) {
      const roleIds = rolePermissions.map((role: any) => role.id);
      await RolePermission.updateMany(
        { id: { $in: roleIds } },
        { $set: { isActive: 0 } }
      );
    }

    if (permissionPayload.roles.length !== 0) {
      permissionPayload.roles.forEach(async (role: any) => {
        const roleRow = await Role.findOne({ roleName: role });

        const rolePermissionBody = {
          roleId: roleRow.id,
          permissionId: permissionRow.id,
        };

        const checkRelationRole = await RolePermission.findOne({
          roleId: roleRow.id,
          permissionId: permissionRow.id,
        });

        if (checkRelationRole) {
          if (checkRelationRole.isActive === false) {
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
    console.log(err, "In create Role Permission");
    return next(new AppError(err, 500));
  }
};

export default {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
};
