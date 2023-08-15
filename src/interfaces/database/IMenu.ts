import { Schema } from "mongoose";
import { eCategory, eRoles } from "../../enums";

export interface IMenu {
  _id: Schema.Types.ObjectId
  caption?: string;
  children?: any; // Array<IMenu>;
  icon: string;
  title: string;
  route: string;
  // TODO: discuss for name of var below
  menuType: eRoles;
  category: eCategory;
  collapisble: boolean;
}
