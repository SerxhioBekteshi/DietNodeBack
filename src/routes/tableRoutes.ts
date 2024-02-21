import express from "express";
import {
  TableConstructor,
  deleteSelected,
  selectAll,
} from "../controllers/tableController";
import { protect } from "../middlewares/protection";
import { getAll } from "../controllers/tableController";
import {
  IAppNotification,
  IMeal,
  IOrder,
  IOrderDetails,
  IPermission,
  IUser,
} from "../interfaces/database";
import UserTable from "../classes/tables/UserTable";
import { capitalize } from "../utils";
import MealTable from "../classes/tables/MealTable";
import OrderTable from "../classes/tables/OrderTable";
import OrderDetailsTable from "../classes/tables/OrderDetailsTable";
import PermissionTable from "../classes/tables/PermissionsTable";
import AppNotificationTable from "../classes/tables/AppNotificationTable";

const router = express.Router();
router.use(protect);

createTableRoutes<IUser>("user", UserTable);
createTableRoutes<IMeal>("meals", MealTable);
createTableRoutes<IOrder>("orders", OrderTable);
createTableRoutes<IOrderDetails>("orderDetails", OrderDetailsTable);
createTableRoutes<IPermission>("permissions", PermissionTable);
createTableRoutes<IAppNotification>("notifications", AppNotificationTable);

function createTableRoutes<T>(route: string, table: TableConstructor<T>) {
  router.post(`/${route}`, getAll<T>(table));
  router.post(`/selectAll${capitalize(route)}`, selectAll<T>(table));
  router.post(`/delete/${capitalize(route)}`, deleteSelected<T>(table));
}

export default router;
