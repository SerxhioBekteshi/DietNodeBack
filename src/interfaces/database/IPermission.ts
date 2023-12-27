export interface IPermission {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  action: string;
  subjectId: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}
