export interface IMenu {
  id: number;
  label: string;
  icon: string;
  to: string;
  // TODO: discuss for name of var below
  roleId: number;
  collapisble?: boolean;
  children?: any; // Array<IMenu>;
}
