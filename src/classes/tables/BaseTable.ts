import mongoose from "mongoose";
import {
  IFilter,
  ISort,
  ITableRequest,
  ITableResponse,
} from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import { eSortType } from "../../enums";
import { buildOperation } from "../../utils";

export default class BaseTable<T> {
  constructor(model: mongoose.Model<T>, request: ITableRequest) {
    this.model = model;
    this.page = request.page;
    this.pageSize = request.pageSize;
    this.sorting = request.sorting || [];
    this.filters = request.filters || [];
    this.search = request.search;
  }

  key: string = "_id";

  model: mongoose.Model<T>;

  page: number = 0;

  pageSize: number = 10;

  search: string;

  filters: IFilter[] = [];

  sorting: ISort[] = [];

  rows: any[];
  // rows: mongoose.IfAny<
  //   T,
  //   any,
  //   mongoose.Document<unknown, {}, T> & Omit<mongoose.Require_id<T>, never>
  // >[];

  columns: IColumn<T>[];

  total: number;

  data: ITableResponse<T>;

  async initialize(): Promise<ITableResponse<T>> {
    this.columns = this.buildColumns();
    this.rows = await this.buildRows();
    this.total = await this.countDocuments();
    const totalPages = Math.ceil(this.total / this.pageSize);
    this.data = {
      rows: this.rows,
      columns: this.columns,
      pageSize: this.pageSize,
      totalCount: this.total,
      totalPages: totalPages,
      currentPage: this.page,
      key: this.key,
      hasNext: this.page < totalPages,
      hasPrevious: this.page > 1,
    };
    return this.data;
  }
  async countDocuments(): Promise<number> {
    return await this.model.countDocuments(this.buildFilters(this.filters));
  }

  buildColumns(): IColumn<T>[] {
    return [];
  }

  async buildRows() {
    try {
      const query = this.model
        .find(this.buildFilters(this.filters))
        .skip((this.page - 1) * this.pageSize)
        .limit(this.pageSize);

      const sort = this.buildSort();

      if (sort) {
        query.sort(sort);
      }

      const rows = await query.lean().exec();

      return rows;
    } catch (error) {
      throw error;
    }
  }

  buildSort() {
    let sortingObj: any = {};
    if (this.sorting.length === 0) return null;
    this.sorting.map((sort) => {
      switch (sort.direction) {
        case eSortType.Asc:
          sortingObj[sort.columnName] = 1;
          break;
        case eSortType.Desc:
          sortingObj[sort.columnName] = -1;
          break;
      }
    });
    return sortingObj;
  }

  buildFilters(filters: IFilter[]) {
    let filterObj: any = this.buildSearch(this.search);

    if (filters.length === 0 && filterObj) return filterObj;
    if (filters.length === 0) return null;
    filters.map((filter) => {
      const operation = buildOperation(filter.operation, filter.value);

      filterObj[filter.columnName] = operation;
    });
    return filterObj;
  }

  buildColumnsToSearch(): (keyof T)[] {
    return [];
  }
  buildSearch(search: string) {
    const pattern = new RegExp(`.*${search}.*`);
    const columnsToSearch = this.buildColumnsToSearch();

    const myModel = mongoose.model(`${this.model}`, this.model.schema);

    // Get all field names and their types that are of the "Number" type
    const numberFields = Object.entries(myModel.schema.paths)
      .filter(
        ([fieldName, field]) => field instanceof mongoose.SchemaTypes.Number
      )
      .map(([fieldName]) => fieldName);

    if (search && columnsToSearch && columnsToSearch.length > 0) {
      const filter = columnsToSearch.map((column: any) => {
        let filtersOnNumberColumns = {};
        if (numberFields.includes(column)) {
          Object.assign(filtersOnNumberColumns, {
            [column]: parseFloat(search),
          });
        } else
          Object.assign(filtersOnNumberColumns, {
            [column]: { $regex: pattern, $options: "i" },
          });

        return filtersOnNumberColumns;
      });
      return { $or: filter };
    }
    return {};
  }

  async selectAll() {
    try {
      const ids = (
        await this.model.find(this.buildFilters(this.filters)).distinct("_id")
      ).map((id) => id.toString());
      return ids;
    } catch (error) {
      throw error;
    }
  }

  async delete(ids: any[]) {
    const res = await this.model.deleteMany({ _id: { $in: ids } });
    return res.deletedCount;
  }
}
