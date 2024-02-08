import { eFilterOperator, eRoles } from "../enums";
import Menu from "../models/menuModel";
import Permission from "../models/permissionModel";
import Role from "../models/roleModel";
import RolePermission from "../models/rolePermissionModel";
import User from "../models/userModel";
import { AppError } from "./appError";

export const getRandomHexadecimal = (size) => {
  return [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
};

export const buildOperation = (operation: eFilterOperator, value: any) => {
  //TODO: anticipate date values
  switch (operation) {
    case eFilterOperator.Contain:
      return { $regex: new RegExp(value, "gi") };
    case eFilterOperator.StartWith:
      return { $regex: new RegExp("\\b" + value, "gi") };
    case eFilterOperator.EndWith:
      return { $regex: new RegExp(value + "\\b", "gi") };
    case eFilterOperator.Equal:
      return { $eq: value };
    case eFilterOperator.Different:
      return { $ne: value };
    case eFilterOperator.GreaterOrEqual:
      return { $gte: value };
    case eFilterOperator.GreaterThan:
      return { $gt: value };
    case eFilterOperator.LessOrEqual:
      return { $lt: value };
    case eFilterOperator.LessThan:
      return { $lte: value };
    // case eFilterOperator.Between:
    //   const splitValue = value.split("-");
    //   return {
    //     $regex: new RegExp(
    //       `^(${Number(splitValue[0])}-${Number(splitValue[1])})$`
    //     ),
    //   };
  }
};

export function isObjEmpty(obj) {
  return Object.values(obj).length === 0 && obj.constructor === Object;
}
export function capitalize(text: string) {
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
}

export function getAutoGeneratedPassword() {
  return `HR@${getRandomHexadecimal(8)}`;
}

export function compareIds(id1, id2) {
  return id1.toString() === id2.toString();
}

export const initializeRoles = async () => {
  const roles = [
    { id: 1, roleName: "admin" },
    { id: 2, roleName: "provider" },
    { id: 3, roleName: "user" },
  ];

  // Check if roles already exist
  const existingRoles = await Role.find();
  if (existingRoles.length === 0) {
    await Role.insertMany(roles);
    console.log("Default roles initialized successfully");
  } else {
    console.log("Roles already exist. Skipping initialization.");
  }
};

export const initializeAdmin = async function () {
  const userAdmin = {
    id: 1,
    email: "serxhio131@gmail.com",
    name: "serxhio",
    lastName: "bekteshi",
    password: "Serxhio123@",
    passwordConfirm: "Serxhio123@",
    quizFulfilled: false,
    accountSubmitted: true,
    nipt: "",
    termsAgreed: false,
    roleId: 1,
  };

  const existingAdmin = await User.find();
  if (existingAdmin.length === 0) {
    await User.create(userAdmin);
    console.log("Default roles initialized successfully");
  } else {
    console.log("Admin already exist. Skipping initialization.");
  }
};

export const initializeMenuItems = async function () {
  const menuItems = [
    // { id: 1, label: "Admin Main Page", icon: "pi pi-user", to: "/", roleId: 1 },
    // {
    //   id: 2,
    //   label: "Provider accounts",
    //   icon: "pi pi-question",
    //   to: "/providers/registration",
    //   roleId: 1,
    // },
    // {
    //   id: 3,
    //   label: "Quiz configuration",
    //   icon: "pi pi-question",
    //   to: "/quiz",
    //   roleId: 1,
    // },
    // {
    //   id: 4,
    //   label: "Orders",
    //   icon: "pi pi-calculator",
    //   to: "/orders",
    //   roleId: 1,
    // },
    // {
    //   id: 5,
    //   label: "Provider Main Page",
    //   icon: "pi pi-user",
    //   to: "/",
    //   roleId: 2,
    // },
    // {
    //   id: 6,
    //   label: "Meals",
    //   icon: "pi pi-box",
    //   to: "/meals",
    //   roleId: 2,
    // },
    // {
    //   id: 7,
    //   label: "Orders",
    //   icon: "pi pi-calculator",
    //   to: "/orders",
    //   roleId: 2,
    // },
    // {
    //   id: 8,
    //   label: "Meals",
    //   icon: "pi pi-box",
    //   to: "/meals",
    //   roleId: 3,
    // },
    // {
    //   id: 9,
    //   label: "Orders",
    //   icon: "pi pi-calculator",
    //   to: "/orders",
    //   roleId: 3,
    // },
    // {
    //   id: 10,
    //   label: "Meals Configurations",
    //   icon: "pi pi-calculator",
    //   to: "/mealsConfigurations",
    //   roleId: 1,
    // },
    // {
    //   id: 13,
    //   label: "Permissions",
    //   icon: "pi pi-wrench",
    //   to: "/permissions",
    //   roleId: 1,
    //   menuType: eRoles.Admin,
    // },
    // {
    //   id: 15,
    //   label: "Provider emails",
    //   icon: "pi pi-send",
    //   to: "/provider/emails",
    //   roleId: 1,
    //   menuType: eRoles.Admin,
    // },
    // { id: 16, label: "Dashboard", icon: "pi pi-user", to: "/" },
    // {
    //   id: 17,
    //   label: "Provider accounts",
    //   icon: "pi pi-question",
    //   to: "/providers/registration",
    // },
    // {
    //   id: 18,
    //   label: "Quiz configuration",
    //   icon: "pi pi-question",
    //   to: "/quiz",
    // },
    // {
    //   id: 19,
    //   label: "Orders",
    //   icon: "pi pi-calculator",
    //   to: "/orders",
    // },
    // {
    //   id: 20,
    //   label: "Meals",
    //   icon: "pi pi-box",
    //   to: "/meals",
    // },
    // {
    //   id: 21,
    //   label: "Meals Configurations",
    //   icon: "pi pi-calculator",
    //   to: "/mealsConfigurations",
    // },
    // {
    //   id: 22,
    //   label: "Permissions",
    //   icon: "pi pi-wrench",
    //   to: "/permissions",
    // },
    // {
    //   id: 23,
    //   label: "Provider emails",
    //   icon: "pi pi-send",
    //   to: "/provider/emails",
    // },
    // {
    //   id: 24,
    //   label: "Users",
    //   icon: "pi pi-user",
    //   to: "/users",
    // },
  ];

  return Menu.insertMany(menuItems);
};

export const getPermissionForLoggedUser = async (user: any, next: any) => {
  try {
    const rolePermissions = await RolePermission.find(
      { roleId: user.roleId, isActive: true },
      "id roleId permissionId isActive"
    );
    const permissionsInfo = await Promise.all(
      rolePermissions.map(async (rolePermission: any) => {
        const permissionId = rolePermission.permissionId;
        const permission = await Permission.findOne({
          id: permissionId,
        });
        if (!permission) {
          return null;
        }
        const { subjectId, action } = permission;
        if (subjectId) {
          const menu = await Menu.findOne({ id: subjectId });
          if (!menu) {
            return null;
          }
          const { label } = menu;
          return { action, subject: label };
        }
        return { action, subject: "" };
      })
    );
    const aclPermissions = permissionsInfo.filter(
      (permission) => permission !== null
    );
    return aclPermissions.filter(
      (permission: any) => permission.subject !== ""
    );
  } catch (err) {
    return next(new AppError(`Something went wrong`, 500));
  }
};
