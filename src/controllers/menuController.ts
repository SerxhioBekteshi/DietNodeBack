import Menu from "../models/menuModel";
import { getAll } from "./handleFactory";

const getMenus = getAll(Menu);

export default { getMenus };
