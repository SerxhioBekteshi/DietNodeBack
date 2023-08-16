import Menu from "../models/menuModel";
import { getAll } from "./handleFactory";

const getMenuItems = async (req, res, next) => {
  const menuItems = await Menu.find({ roleId: req.roleId });
  res.status(200).json(menuItems);
};

export default { getMenuItems };
