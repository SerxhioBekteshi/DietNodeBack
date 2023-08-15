import BaseTable from './BaseTable';
import { IUser } from '../../interfaces/database';
import User from '../../models/userModel';
import { IFilter, ITableRequest } from '../../interfaces/table';
import IColumn from '../../interfaces/table/IColumn';
import { eColumnType, eFilterOperator, eRoles } from '../../enums';

export default class UserTable extends BaseTable<IUser> {
  constructor(request: ITableRequest, user: any) {
    super(User, request, user);
  }
  override async buildRows(): Promise<any> {
    const rows = await super.buildRows();
    const res = rows.map(row => {
      const newRow = row;
      return { ...newRow, name: { value: newRow.name, photo: `images/users/${row.photo}` } }
    })
    return res;
  }
  override buildFilters(filters: IFilter[]) {
    const newFilters: IFilter[] = [...filters];
    newFilters.push({
      columnName: 'active',
      operation: eFilterOperator.Different,
      value: false
    });
    if ([eRoles.User, eRoles.Manager].includes(this.user.role)) {
      newFilters.push({
        columnName: 'assignedTo',
        operation: eFilterOperator.Equal,
        value:
          this.user.role === eRoles.User
            ? (this.user.assignedTo as any)
            : (this.user as any)._id,
      });
    } else {
      newFilters.push({
        columnName: '_id',
        operation: eFilterOperator.Different,
        value: (this.user as any)._id,
      });
    }
    newFilters.push({
      columnName: 'customer',
      operation: eFilterOperator.Equal,
      value: this.user.customer as any,
    });
    return super.buildFilters(newFilters);
  }
  override buildColumns(): IColumn<IUser>[] {
    const columns: IColumn<IUser>[] = [
      {
        title: 'Name', // TODO: Translation
        propertyName: 'name',
        propertyType: eColumnType.String,
        filtrable: true,
        hasExtraData: true,
        style: { fontWeight: 500 }
      },
      {
        title: 'Last Name', // TODO: Translation
        propertyName: 'lastName',
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: 'Position', // TODO: Translation
        propertyName: 'position',
        propertyType: eColumnType.String,
        filtrable: true,
      },
      {
        title: 'Email', // TODO: Translation
        propertyName: 'email',
        propertyType: eColumnType.String,
        filtrable: true,
      },
    ];
    if ([eRoles.Admin, eRoles.Manager].includes(this.user.role)) {
      columns.push({
        propertyType: eColumnType.Icons,
        icons: [{ icon: 'Edit', name: 'edit' }],
      });
    }

    return columns;
  }
  override async delete(ids: any[]): Promise<number> {
    const res = await User.updateMany({ _id: { $in: ids } }, { active: false });
    return res.nModified;
  }

}
