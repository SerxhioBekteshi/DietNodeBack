import { Schema } from "mongoose";
import { eRoles } from "../../enums";

export interface IMenu {
  id: Number;
  label?: string;
  icon: string;
  to: string;
  roleId: number;
  collapisble: boolean;
  parentId: number;
  shouldDisplay?: boolean;
}
