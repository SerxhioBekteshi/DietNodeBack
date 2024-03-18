import { eColumnType, eRoles } from "../../enums";
import { IMeal } from "../../interfaces/database";
import { ITableRequest } from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import Meal from "../../models/mealModel";
import MealRating from "../../models/mealRatingModel";
import BaseTable from "./BaseTable";

export default class MealTable extends BaseTable<IMeal> {
  constructor(request: ITableRequest, user: any) {
    super(Meal, request, user);
  }

  override buildColumnsToSearch(): (keyof IMeal)[] {
    return ["name", "dietCategory", "cousine", "intolerance"];
    // const columnNames = Object.keys(Meal.schema.paths);
    // return columnNames
  }
  override async buildRows(): Promise<IMeal[]> {
    try {
      const matchFilters = this.buildFilters(this.filters);

      let ratings = null;
      let ratingsMap = null;
      ratings = await MealRating.aggregate([
        {
          $group: {
            _id: "$mealId",
            avgRating: { $avg: "$rating" },
          },
        },
      ]).exec();

      ratingsMap = new Map(
        ratings.map((rating: any) => [rating._id, rating.avgRating])
      );
      const pipeline = [
        {
          $match: matchFilters,
        },
        {
          $lookup: {
            from: "MealRating",
            localField: "id",
            foreignField: "mealId",
            as: "ratings",
          },
        },
        {
          $addFields: {
            avgRating: {
              $ifNull: [{ $avg: "$ratings.rating" }, 0],
            },
          },
        },
        {
          $project: {
            ratings: 0,
          },
        },
        {
          $skip: (this.page - 1) * this.pageSize,
        },
        {
          $limit: this.pageSize,
        },
      ];

      const meals = await this.model.aggregate(pipeline).exec();
      meals.forEach((meal: any) => {
        meal.rating = ratingsMap.get(meal.id) || 0;
      });

      return meals;
    } catch (err) {
      console.log(err, "ERROR");
    }
  }
  override buildColumns(): IColumn<IMeal>[] {
    const columns: IColumn<IMeal>[] = [
      {
        title: "Name",
        propertyName: "name",
        propertyType: eColumnType.String,
        filtrable: true,
        hasExtraData: true,
        style: { fontWeight: 500 },
      },
      {
        title: "Cousine",
        propertyName: "cousine",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Image",
        propertyName: "image",
        propertyType: eColumnType.Image,
        filtrable: true,
      },
      {
        title: "Carbon Footprint",
        propertyName: "carbonFootprint",
        propertyType: eColumnType.Number,
        filtrable: true,
      },
      {
        title: "Category",
        propertyName: "dietCategory",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Calories",
        propertyName: "calories",
        propertyType: eColumnType.Number,
        filtrable: true,
      },
      {
        title: "Intolerance",
        propertyName: "intolerance",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Ingredients",
        propertyName: "ingredients",
        propertyType: eColumnType.Array,
        filtrable: true,
      },
      {
        title: "Icons",
        propertyName: "icons",
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
