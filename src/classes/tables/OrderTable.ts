import { match } from "assert";
import { eColumnType, eFilterOperator, eRoles } from "../../enums";
import { IOrder } from "../../interfaces/database";
import { IFilter, ITableRequest } from "../../interfaces/table";
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

  // override buildFilters(filters: IFilter[]) {
  //   const newFilters: IFilter[] = [...filters];
  //   newFilters.push({
  //     columnName: "role",
  //     operation: eFilterOperator.Equal,
  //     value: (this.user as any).role,
  //   });
  //   return super.buildFilters(newFilters);
  // }

  override async buildRows(requestUser: any): Promise<IOrder[]> {
    const matchFilters = this.buildFilters(this.filters);
    let match = {};
    if (requestUser.role === eRoles.User) {
      // matchFilters.columnName = "userId";
      // matchFilters.operation = eFilterOperator.Equal;
      // matchFilters.value = requestUser.Iid;
      match = {
        userId: requestUser.id,
      };
    }

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
        $match: match,
      },
      {
        $project: {
          id: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          icons: 1,
          // userName: "$user.name",
          userName: {
            $cond: {
              if: {
                $or: [
                  { $eq: [requestUser.role, eRoles.Provider] },
                  { $eq: [requestUser.role, eRoles.Admin] },
                ],
              },
              then: "$user.name",
              else: null,
            },
          },
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
  override buildColumns(requestUser: any): IColumn<IOrder>[] {
    let columns: IColumn<IOrder>[] = [
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
        propertyName: "updatedAt",
        propertyType: eColumnType.DateTime,
        filtrable: true,
      },
      {
        title: "Icons",
        propertyName: "icons",
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
    if (requestUser.role === eRoles.User) {
      columns = columns.filter((col: any) => col.title !== "User");
    }
    return columns;
  }
}
