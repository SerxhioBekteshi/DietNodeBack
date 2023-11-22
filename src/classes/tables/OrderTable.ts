import { eColumnType } from "../../enums";
import { IOrder } from "../../interfaces/database";
import { ITableRequest } from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import Order from "../../models/orderModel";
import User from "../../models/userModel";
import BaseTable from "./BaseTable";

export default class OrderTable extends BaseTable<IOrder> {
  constructor(request: ITableRequest, user: any) {
    super(Order, request, user);
  }

  //   override buildColumnsToSearch(): (keyof IOrder)[] {
  //     return ["name", "dietCategory", "cousine", "intolerance"];
  //     // const columnNames = Object.keys(Meal.schema.paths);
  //     // return columnNames
  //   }

  override async buildRows(): Promise<IOrder[]> {
    const matchFilters = this.buildFilters(this.filters);
    const pipeline = [
      {
        $match: matchFilters,
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: "userId",
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
          status: 1,
          createdAt: 1,
          updated: 1,
          Icons: 1,
          userName: "$user.name",
        },
      },
      {
        $skip: (this.page - 1) * this.pageSize,
      },
      {
        $limit: this.pageSize,
      },
    ];

    const orders = await this.model.aggregate(pipeline).exec();

    return orders;
  }
  override buildColumns(): IColumn<IOrder>[] {
    const columns: IColumn<IOrder>[] = [
      {
        title: "User",
        propertyName: "userName",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Status",
        propertyName: "status",
        propertyType: eColumnType.Status,
        filtrable: true,
      },
      {
        title: "Date created",
        propertyName: "createdAt",
        propertyType: eColumnType.DateTime,
        filtrable: true,
      },
      {
        title: "Date Updated",
        propertyName: "UpdatedAt",
        propertyType: eColumnType.DateTime,
        filtrable: true,
      },
      {
        title: "Icons",
        propertyName: "Icons",
        propertyType: eColumnType.Icons,
        icons: [
          {
            icon: "details",
            color: "primary",
            name: "pi pi-arrow-up-right",
          },
        ],
      },
    ];

    return columns;
  }
}
