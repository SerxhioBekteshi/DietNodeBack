import { deleteOne, getOne, updateOne } from "./handleFactory";
import { catchAsync } from "../utils/catchAsync";
import Permission from "../models/permissionModel";

const getPermission = getOne(Permission);

const updatePermission = updateOne(Permission);

const deletePermission = deleteOne(Permission);

const createPermission = catchAsync(async (req: any, res: any) => {
  console.log(req.body);
  req.body.createdBy = req.user.id;
  const doc = await Permission.create(req.body);
  res.status(200).json({ doc: doc, message: "Created successfully" });
});

export default {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
};
