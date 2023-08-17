import IFilter from "./IFilter";
import ISort from "./ISort";

export default interface ITableRequest {
  page: number;
  pageSize: number;
  filters?: IFilter[];
  sorting?: ISort[];
  search?: string;
}
