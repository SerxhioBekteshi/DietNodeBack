import { eColumnType } from "../../enums";
import { IOrderDetails } from "../../interfaces/database";
import { ITableRequest } from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import OrderDetails from "../../models/orderDetailModel";
import BaseTable from "./BaseTable";

export default class OrderDetailsTable extends BaseTable<IOrderDetails> {
  constructor(request: ITableRequest, user: any) {
    super(OrderDetails, request, user);
  }

  //   override buildColumnsToSearch(): (keyof IOrder)[] {
  //     return ["name", "dietCategory", "cousine", "intolerance"];
  //     // const columnNames = Object.keys(Meal.schema.paths);
  //     // return columnNames
  //   }

  override async buildRows(): Promise<IOrderDetails[]> {
    const rows = this.buildRows();
    return rows;
  }
  override buildColumns(): IColumn<IOrderDetails>[] {
    const columns: IColumn<IOrderDetails>[] = [
      {
        title: "Order Id",
        propertyName: "orderId",
        propertyType: eColumnType.Number,
        filtrable: true,
      },
      {
        title: "Order ID payal",
        propertyName: "orderIdGenerated",
        propertyType: eColumnType.Status,
        filtrable: true,
      },
      {
        title: "payer",
        propertyName: "createdAt",
        propertyType: eColumnType.DateTime,
        filtrable: true,
      },
      {
        title: "Time created",
        propertyName: "create_time",
        propertyType: eColumnType.DateTime,
        filtrable: true,
      },
      {
        title: "Intent",
        propertyName: "intent",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Links",
        propertyName: "links",
        propertyType: eColumnType.Select,
        filtrable: true,
      },
      {
        title: "Items",
        propertyName: "Purchase Units",
        propertyType: eColumnType.Select,
        filtrable: true,
      },
    ];

    return columns;
  }
}
