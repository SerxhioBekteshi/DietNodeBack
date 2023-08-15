import IColumn from './IColumn';

export default interface ITableResponse<T> {
  columns: IColumn<T>[];
  rows: any[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  canDelete: boolean;
  key: any;
}
