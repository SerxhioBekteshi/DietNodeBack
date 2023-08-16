import { IMeal } from "../../interfaces/database";
import { ITableRequest } from "../../interfaces/table";
import Meal from "../../models/mealModel";
import BaseTable from "./BaseTable";

export default class MealTable extends BaseTable<IMeal> {
  constructor(request: ITableRequest) {
    super(Meal, request);
  }

  override async buildRows(): Promise<any> {
    const rows = await super.buildRows();
    const res = rows.map((row) => {
      const newRow = row;
      return {
        ...newRow,
        name: { value: newRow.name, image: `images/users/${row.image}` },
      };
    });
    return res;
  }
}
