import { ISelectOption } from '..';
import { eColumnType } from '../../enums';

export interface ITableIcons {
  icon?: string;
  name?: string;
  color?: string;
}
export interface ITableActions {
  name: string
  label: string;
  outline?: boolean;
  color?: string;
}
export interface ITableTag {
  text: string
  color: string;
}

export default interface IColumn<T = {}> {
  title?: string;
  propertyName?: keyof T | string;
  propertyType: eColumnType;
  hidden?: boolean;
  filtrable?: boolean;
  unSortable?: boolean;
  icons?: ITableIcons[];
  selectItems?: Array<ISelectOption>
  hasExtraData?: boolean;
  style?: any;
}
