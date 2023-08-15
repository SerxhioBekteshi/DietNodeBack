import { IUser } from "./database";

interface ISession {
  sessionId: string;
  user: IUser;
  access_token?: string;
  refresh_token?: string;
}

interface ISelectOption {
  label: any;
  value: any;
}
export { ISession, ISelectOption };
