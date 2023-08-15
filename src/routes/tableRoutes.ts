import express from "express";
import {
  TableConstructor,
  deleteSelected,
  selectAll,
} from "../controllers/tableController";
import { protect } from "../middlewares/protection";
import { getAll } from "../controllers/tableController";
import { IUser } from "../interfaces/database";
import UserTable from "../classes/tables/UserTable";
import { capitalize } from "../utils";

const router = express.Router();
router.use(protect);

createTableRoutes<IUser>("users", UserTable);

function createTableRoutes<T>(route: string, table: TableConstructor<T>) {
  router.post(`/${route}`, getAll<T>(table));
  router.post(`/selectAll${capitalize(route)}`, selectAll<T>(table));
  router.post(`/delete${capitalize(route)}`, deleteSelected<T>(table));
}

export default router;
