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
  const query = await Permission.findOneAndDelete({ id: req.params.id });
  if (!query) {
    return next(new AppError("No doc find with that id", 404));
  }

  if (query) {
    const rolePermissions = await RolePermission.deleteMany({
      permissionId: req.params.id,
    });

    const menuPermissions = await MenuPermission.deleteMany({
      permissionId: req.params.id,
    });
  }

  res.status(200).json({ message: "Permision deleted successfully" });
});

const createPermission = catchAsync(async (req: any, res: any, next: any) => {
  req.body.createdBy = req.user.id;

  const menuItems = await Menu.find({ id: { $gt: 15 } })
    .select("label")
    .lean();
  if (!menuItems.includes(req.body.name) && req.body.subjectId === null) {
    //in name not same as the menu (subjectId null) -> throw error
    return next(
      new AppError(
        "Can't create permission if the name does not correlate with the name of one of the menu items",
        500
      )
    );
  } else {
    //else subjectId not null but the name still
    if (req.body.subjectId !== null) {
      console.log(isNaN(req.body.subjectId));
      if (isNaN(req.body.subjectId)) {
        //but the subjectId is string isntead
        try {
          const lastMenuItem = await Menu.findOne().sort({ _id: -1 }).exec();

          //before creation check if it is already created once
          const menuItem = await Menu.findOne({
            label: req.body.subjectId,
            id: { $gt: 15 },
          });

          if (menuItem) {
            //if it already exists throw an error
            return next(
              new AppError(
                "Can't create permission because the custom subject it is already once created",
                400
              )
            );
          } else {
            //otherwise
            const menuCreated = await Menu.create({
              id: lastMenuItem.id + 1,
              shouldDisplay: false,
              label: req.body.subjectId, //here i can make it splittable by capital or change the front to a certain format
              menuType: [],
              to: "",
            });

            if (menuCreated) {
              //if created determine the id of the menu subject created
              req.body.subjectId = menuCreated.id;
            }
          }
        } catch (error: any) {
          return next(new AppError(error.message, 500));
        }
      } else {
        req.body.name = `${req.body.action} ${req.body.name}`;
      }
    }
  }

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
    if (permissionPayload.subjectId === null) {
      const menuItem = await Menu.findOne({
        label: permissionPayload.name,
        id: { $gt: 15 },
      });

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
  next: any
) => {
  const rolePermissions = await RolePermission.find({
    permissionId: permissionRow.id,
  });

  try {
    //THIS LOGIC SHOULD BE RESEEN BECAUSE WHEN I ADDED THE PROVIDER ROLE AND REMOVED IT IT STILL WAS COMING
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
    } else {
      return next(new AppError("Specify roles for this permission", 500));
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
