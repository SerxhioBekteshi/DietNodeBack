import { Schema } from "mongoose";

export interface IAppNotification {
  id: number;
  _id: Schema.Types.ObjectId;
  message: any;
  route: string;
  seen: boolean;
  createdAt: Date;
  sender: number;
  receiver: number;
  user: number;
  title: string;
}
