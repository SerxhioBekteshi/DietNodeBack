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
      // if (this.user.role === eRoles.Provider) {
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
      // } else {
      // }

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
