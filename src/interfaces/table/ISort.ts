import { eSortType } from "../../enums";

export default interface ISort {
  columnName: string;
  direction: eSortType;
}
