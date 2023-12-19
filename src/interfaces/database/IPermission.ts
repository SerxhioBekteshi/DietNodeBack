export interface IPermission {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  action: string;
  menuId: number;
  createdBy: number;
  createdAt: boolean;
  updatedAt: boolean;
}
