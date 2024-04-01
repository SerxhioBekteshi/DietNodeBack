import BaseTable from "./BaseTable";
import { IUser } from "../../interfaces/database";
import User from "../../models/userModel";
import { IFilter, ITableRequest } from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import { eColumnType, eRoles } from "../../enums";

export default class UserTable extends BaseTable<IUser> {
  constructor(request: ITableRequest, user: any) {
    super(User, request, user);
  }

  override async buildRows(): Promise<any> {
    const rows = await super.buildRows();
    const res = rows.map((row) => {
      const newRow = row;
      return {
        ...newRow,
        fullName: `${newRow.name} ${newRow.lastName}`,
        image: `images/users/${row.image}`,
      };
    });
    return res;
  }
  override buildFilters(filters: IFilter[]) {
    const baseFilters = super.buildFilters(filters);
    const roleFilter = { role: { $in: [eRoles.Provider, eRoles.User] } };
    const allFilters = { ...baseFilters, ...roleFilter };
    return allFilters;
  }

  override buildColumns(): IColumn<IUser>[] {
    let columns: IColumn<IUser>[] = [
      {
        title: "Full Name",
        propertyName: "fullName",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Role",
        propertyName: "role",
        propertyType: eColumnType.Link,
        link: "systemUser",
        filtrable: true,
      },
      {
        title: "Email",
        propertyName: "email",
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
        title: "State",
        propertyName: "state",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "NIPT",
        propertyName: "nipt",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Phone number",
        propertyName: "phoneNumber",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Account Submitted",
        propertyName: "accountSubmitted",
        propertyType: eColumnType.Boolean,
        filtrable: true,
      },
      {
        title: "Quiz fulfilled",
        propertyName: "quizFulfilled",
        propertyType: eColumnType.Boolean,
        filtrable: true,
      },
      {
        title: "Icons",
        propertyName: "icons",
        propertyType: eColumnType.Icons,
        icons: [
          // {
          //   icon: "edit",
          //   color: "primary",
          //   name: "pi pi-file-edit",
          // },
          { icon: "delete", color: "danger", name: "pi pi-trash" },
        ],
      },
    ];

    return columns;
  }

  override async delete(
    ids: any[]
  ): Promise<{ deleteCount: number; message: string }> {
    const res = await User.updateMany({ _id: { $in: ids } }, { active: false });
    return {
      deleteCount: res.nModified,
      message: `${res.nModified} were updated successfully`,
    };
  }
}
