import BaseTable from "./BaseTable";
import { IUser } from "../../interfaces/database";
import User from "../../models/userModel";
import { IFilter, ITableRequest } from "../../interfaces/table";
import IColumn from "../../interfaces/table/IColumn";
import { eColumnType } from "../../enums";

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
        name: { value: newRow.name, photo: `images/users/${row.photo}` },
      };
    });
    return res;
  }
  override buildFilters(filters: IFilter[]) {
    const newFilters: IFilter[] = [...filters];
    return super.buildFilters(newFilters);
  }
  override buildColumns(): IColumn<IUser>[] {
    const columns: IColumn<IUser>[] = [
      {
        title: "Name", // TODO: Translation
        propertyName: "name",
        propertyType: eColumnType.String,
        filtrable: true,
        hasExtraData: true,
        style: { fontWeight: 500 },
      },
      {
        title: "Last Name", // TODO: Translation
        propertyName: "lastName",
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: "Email", // TODO: Translation
        propertyName: "email",
        propertyType: eColumnType.String,
        filtrable: true,
      },
    ];

    return columns;
  }
  override async delete(ids: any[]): Promise<number> {
    const res = await User.updateMany({ _id: { $in: ids } }, { active: false });
    return res.nModified;
  }
}
