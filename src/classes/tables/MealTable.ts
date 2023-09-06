import { eColumnType } from "../../enums";
import { IMeal } from "../../interfaces/database";
import { ITableRequest } from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import Meal from "../../models/mealModel";
import BaseTable from "./BaseTable";

export default class MealTable extends BaseTable<IMeal> {
  constructor(request: ITableRequest) {
    super(Meal, request);
  }

  override buildColumnsToSearch(): (keyof IMeal)[] {
    return ["name", "dietCategory"];
    // const columnNames = Object.keys(Meal.schema.paths);
    // return columnNames
  }
  override buildColumns(): IColumn<IMeal>[] {
    const columns: IColumn<IMeal>[] = [
      {
        title: "Name", // TODO: Translation
        propertyName: "name",
        propertyType: eColumnType.String,
        filtrable: true,
        hasExtraData: true,
        style: { fontWeight: 500 },
      },
      {
        title: "Cousine", // TODO: Translation
        propertyName: "cousine",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Image", // TODO: Translation
        propertyName: "image",
        propertyType: eColumnType.Image,
        filtrable: true,
      },
      {
        title: "Carbon Footprint", // TODO: Translation
        propertyName: "carbonFootprint",
        propertyType: eColumnType.Number,
        filtrable: true,
      },
      {
        title: "Category", // TODO: Translation
        propertyName: "dietCategory",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Calories", // TODO: Translation
        propertyName: "calories",
        propertyType: eColumnType.Number,
        filtrable: true,
      },
      {
        title: "Intolerance", // TODO: Translation
        propertyName: "intolerance",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Ingredients", // TODO: Translation
        propertyName: "ingredients",
        propertyType: eColumnType.Tags,
        filtrable: true,
      },
      {
        title: "Icons",
        propertyName: "Icons",
        propertyType: eColumnType.Icons,
        icons: [
          {
            icon: "edit",
            color: "primary",
            name: "pi pi-file-edit",
          },
          { icon: "delete", color: "danger", name: "pi pi-trash" },
        ],
      },
    ];

    return columns;
  }
}
