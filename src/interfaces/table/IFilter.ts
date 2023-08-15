import { eFilterOperator } from "../../enums";

export default interface IFilter {
  columnName: string;
  value?: any;
  operation?: eFilterOperator;
  description?: string;
}
