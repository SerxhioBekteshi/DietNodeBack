import { eColumnType, eRoles } from "../../enums";
import { IOrder, IPermission } from "../../interfaces/database";
import { ITableRequest } from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import Menu from "../../models/menuModel";
import MenuPermission from "../../models/menuPermissionsModel";
import Permission from "../../models/permissionModel";
import RolePermission from "../../models/rolePermissionModel";
import User from "../../models/userModel";
import BaseTable from "./BaseTable";

export default class PermissionTable extends BaseTable<IPermission> {
  constructor(request: ITableRequest, user: any) {
    super(Permission, request, user);
  }

  //   override buildColumnsToSearch(): (keyof IOrder)[] {
  //     return ["name", "dietCategory", "cousine", "intolerance"];
  //     // const columnNames = Object.keys(Meal.schema.paths);
  //     // return columnNames
  //   }

  override async buildRows(): Promise<IPermission[]> {
    const matchFilters = this.buildFilters(this.filters);
    const pipeline = [
      {
        $match: matchFilters,
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: "createdBy",
          foreignField: "id",
          as: "createdByUser",
        },
      },
      {
        $lookup: {
          from: Menu.collection.name,
          localField: "subjectId",
          foreignField: "id",
          as: "menu",
        },
      },
      {
        $unwind: {
          path: "$createdByUser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          id: "$id",
          name: "$name",
          description: "$description",
          isActive: "$isActive",
          createdBy: "$createdBy",
          createdByFullName: {
            $concat: ["$createdByUser.name", " ", "$createdByUser.lastName"],
          },
          action: "$action",
          subjectId: "$subjectId",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          menuTitle: {
            $ifNull: [{ $arrayElemAt: ["$menu.label", 0] }, null],
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

    const permissions = await this.model.aggregate(pipeline).exec();
    return permissions;
  }

  override buildColumns(): IColumn<IPermission>[] {
    let columns: IColumn<IPermission>[] = [
      {
        title: "Name",
        propertyName: "name",
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
        title: "isActive",
        propertyName: "isActive",
        propertyType: eColumnType.Boolean,
        filtrable: true,
      },
      {
        title: "Created By Full Name",
        propertyName: "createdByFullName",
        propertyType: eColumnType.String,
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
        title: "Action",
        propertyName: "action",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Menu Title",
        propertyName: "menuTitle",
        propertyType: eColumnType.String,
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

  override async delete(ids: any[]) {
    try {
      const res = await this.model.deleteMany({ id: { $in: ids } });
      if (res && res.deletedCount) {
        ids.forEach(async (id: any) => {
          await RolePermission.deleteMany({
            permissionId: id,
          });

          await MenuPermission.deleteMany({
            permissionId: id,
          });
        });
      }
      return {
        deleteCount: res.deletedCount,
        message: `${res.deletedCount} were deleted successfully`,
      };
    } catch (err) {
      //i should do next here????
    }
  }
}
