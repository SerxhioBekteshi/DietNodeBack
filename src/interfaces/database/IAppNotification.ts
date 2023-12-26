import { Schema } from "mongoose";

export interface IAppNotification {
  _id: Schema.Types.ObjectId;
  message: any;
  route: string;
  seen: boolean;
  createdAt: Date;
  customer: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}
