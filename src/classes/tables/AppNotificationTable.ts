import BaseTable from "./BaseTable";
import { IFilter, ITableRequest } from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import { eColumnType, eFilterOperator } from "../../enums";
import { IAppNotification } from "../../interfaces/database/IAppNotification";
import AppNotification from "../../models/notificationModel";

export default class AppNotificationTable extends BaseTable<IAppNotification> {
  constructor(request: ITableRequest, user: any) {
    super(AppNotification, request, user);
  }

  override async buildRows() {
    try {
      const rows = await super.buildRows();
      const query = AppNotification.find(this.buildFilters(this.filters))
        .populate("sender")
        .skip((this.page - 1) * this.pageSize)
        .limit(this.pageSize);

      const sort = this.buildSort();

      if (sort) {
        query.sort(sort);
      }

      const rows2 = await query.lean().exec();
      console.log(rows2, "aaaaaaaa");
      return rows;
    } catch (error) {
      throw error;
    }
  }
  override buildSort() {
    const sort = super.buildSort();
    return { ...sort, createdAt: -1 };
  }
  override buildFilters(filters: IFilter[]) {
    const newFilters: IFilter[] = [...filters];
    newFilters.push({
      columnName: "user",
      operation: eFilterOperator.Equal,
      value: (this.user as any).id,
    });
    return super.buildFilters(newFilters);
  }
  override buildColumns(): IColumn<IAppNotification>[] {
    return [
      {
        title: "Message",
        propertyName: "message",
        propertyType: eColumnType.String,
      },
      {
        title: "Route",
        propertyName: "route",
        propertyType: eColumnType.String,
      },
      {
        title: "Seen",
        propertyName: "seen",
        propertyType: eColumnType.Boolean,
      },
    ];
  }
}
