import { eOrderStatus } from "../../enums";

export default interface IOrder {
  id: number;
  userId: number;
  status: eOrderStatus;
}
