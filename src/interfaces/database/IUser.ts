import mongoose, { Schema } from "mongoose";
import { eRoles } from "../../enums";
import { IMenu } from "./IMenu";
export interface IVacationAllocation {
  allocationDate: Date;
  vacationDays: number;
  expirationDate: Date;
}

export interface ACL {
  action: string;
  subject: string;
}

export interface IUser {
  id: Number;
  _id: Schema.Types.ObjectId;
  name: string;
  roleId: Number;
  role: eRoles;
  quizFulfilled: Boolean;
  accountSubmitted: Boolean;
  accessPermissions: ACL[];
  nipt: String;
  termsAgreed: String;
  address: String;
  state: String;
  image: string;
  email: string;
  createdAt: Date;
  active: boolean;
  lastName: string;
  password: string;
  verified: boolean;
  createdBy?: String;
  phoneNumber: string;
  menu: IMenu | IMenu[];
  passwordConfirm: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  gender?: string;
  birthDate?: Date;
  firstLogin?: boolean;
  createPasswordResetToken: () => string;
  changePasswordAfter: (iat: number) => boolean;
  correctPassword: (
    reqPassword: string,
    currentPassword: string
  ) => Promise<boolean>;
}
