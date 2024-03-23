import { eOrderStatus } from "../../enums";

export default interface IOrder {
  id: number;
  userId: number;
  meals: number[];
  status: eOrderStatus;
}
