import IFilter from './IFilter';
import ISort from './ISort';

export default interface ITableRequest {
  page: number;
  limit: number;
  filters?: IFilter[];
  sorting?: ISort[];
  search?: string;
  customParameters?: any; //TODO
}
