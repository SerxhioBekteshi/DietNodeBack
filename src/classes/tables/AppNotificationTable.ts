import BaseTable from "./BaseTable";
import { IFilter, ITableRequest } from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import { eColumnType, eFilterOperator } from "../../enums";
import { IAppNotification } from "../../interfaces/database/IAppNotification";
import AppNotification from "../../models/notificationModel";
import User from "../../models/userModel";

export default class AppNotificationTable extends BaseTable<IAppNotification> {
  constructor(request: ITableRequest, user: any) {
    super(AppNotification, request, user);
  }

  override async buildRows() {
    try {
      // const rows = await super.buildRows();
      const matchFilters = this.buildFilters(this.filters);

      const pipeline = [
        {
          $match: matchFilters,
        },
        {
          $lookup: {
            from: User.collection.name,
            localField: "user",
            foreignField: "id",
            as: "users",
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$users", 0] },
          },
        },
        {
          $project: {
            id: 1,
            message: 1,
            route: 1,
            updatedAt: 1,
            seen: 1,
            sender: 1,
            createdAt: 1,
            user: { name: "$user.name", lastName: "$user.lastName" },
          },
        },
        {
          $skip: (this.page - 1) * this.pageSize,
        },
        {
          $limit: this.pageSize,
        },
      ];
      const rows = await this.model.aggregate(pipeline).exec();
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
