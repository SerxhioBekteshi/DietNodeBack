import BaseTable from "../classes/tables/BaseTable";

export type TableConstructor<T> = new (req: any, user: any) => BaseTable<T>;

const getAll =
  <T>(TableClass: TableConstructor<T>) =>
  async (req: any, res: any, next: any) => {
    const table = new TableClass(req.body, req.user);
    const data = await table.initialize();
    res.json(data);
  };
const selectAll =
  <T>(TableClass: TableConstructor<T>) =>
  async (req: any, res: any, next: any) => {
    const table = new TableClass(req.body, req.user);
    const data = await table.selectAll();
    res.json(data);
  };
const deleteSelected =
  <T>(TableClass: TableConstructor<T>) =>
  async (req: any, res: any, next: any) => {
    console.log(req.body);
    const table = new TableClass(req.body, req.user);
    const deleteRes = await table.delete(req.body.ids);
    res.json(deleteRes);
  };

export { getAll, selectAll, deleteSelected };
