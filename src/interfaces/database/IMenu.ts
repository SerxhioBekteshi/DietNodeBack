import { Schema } from "mongoose";
import { eRoles } from "../../enums";

export interface IMenu {
  id: Number;
  label?: string;
  icon: string;
  to: string;
  roleId: Number;
  collapisble: boolean;
  children?: Array<IMenu>;
  menuType: eRoles;
}
