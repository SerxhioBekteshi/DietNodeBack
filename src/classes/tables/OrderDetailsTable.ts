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
    const rows = await super.buildRows();
    const res = rows.map((row: any) => {
      const newRow = row;
      return {
        ...newRow,
        valuePaid: `${newRow.valuePaid}` + ` ${newRow.currency}`,
        description: "Not key row for the moment",
        address: "not key row for the moment ",
        payer: this.convertToObjectStructure(newRow.payer),
        items: this.convertArrayToObjectStructure(newRow.items),
      };
    });

    return res;
  }

  public convertToObjectStructure = (obj: any) => {
    const converted = [];
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        converted.push({
          key: key,
          label: key,
          items: this.convertToObjectStructure(obj[key]),
        });
      } else {
        converted.push({
          key: key,
          label: `${key}: ${obj[key]}`,
          value: obj[key],
        });
      }
    }
    return converted;
  };

  public convertArrayToObjectStructure(arr: any) {
    const converted = [];
    arr.forEach((item: any, index: number) => {
      const itemObject = {
        key: index.toString(),
        label: item.name,
        items: [],
      };
      for (const key in item) {
        if (typeof item[key] === "object" && item[key] !== null) {
          itemObject.items.push({
            key: key,
            label: key,
            items: this.convertToObjectStructure(item[key]),
          });
        } else {
          itemObject.items.push({
            key: key,
            label: `${key}: ${item[key]}`,
            value: item[key],
          });
        }
      }
      converted.push(itemObject);
    });
    return converted;
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
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Payer",
        propertyName: "payer",
        propertyType: eColumnType.Object,
        filtrable: true,
      },
      {
        title: "Intent",
        propertyName: "intent",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Description",
        propertyName: "description",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Value Paid",
        propertyName: "valuePaid",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Address",
        propertyName: "address",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Link",
        propertyName: "link",
        propertyType: eColumnType.Link,
        filtrable: true,
      },
      {
        title: "Items",
        propertyName: "items",
        propertyType: eColumnType.Array,
        filtrable: true,
      },
      {
        title: "Time created",
        propertyName: "create_time",
        propertyType: eColumnType.DateTime,
        filtrable: true,
      },
    ];

    return columns;
  }
}
