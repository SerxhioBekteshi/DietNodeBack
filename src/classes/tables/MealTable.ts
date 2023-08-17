import { IMeal } from "../../interfaces/database";
import { ITableRequest } from "../../interfaces/table";
import Meal from "../../models/mealModel";
import BaseTable from "./BaseTable";

export default class MealTable extends BaseTable<IMeal> {
  constructor(request: ITableRequest) {
    super(Meal, request);
  }

  override buildColumnsToSearch(): (keyof IMeal)[] {
    return ["name"];
  }
  // override buildColumns(): IColumn<IUser>[] {
  //   const columns: IColumn<IMeal>[] = [
  //     {
  //       title: "Name", // TODO: Translation
  //       propertyName: "name",
  //       propertyType: eColumnType.String,
  //       filtrable: true,
  //       hasExtraData: true,
  //       style: { fontWeight: 500 },
  //     },
  //     {
  //       title: "Last Name", // TODO: Translation
  //       propertyName: "lastName",
  //       propertyType: eColumnType.String,
  //       filtrable: true,
  //     },
  //     {
  //       title: "Email", // TODO: Translation
  //       propertyName: "email",
  //       propertyType: eColumnType.String,
  //       filtrable: true,
  //     },
  //   ];

  //   return columns;
  // }
}
