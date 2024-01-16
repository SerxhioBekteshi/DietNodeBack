import { eRoles } from "../enums";
import AppNotification from "../models/notificationModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { updateOne } from "./handleFactory";

const updateNotification = updateOne(AppNotification);

const markAllRead = catchAsync(async (req: any, res: any, next: any) => {
  const { user } = req;
  if (!user) {
    return next(new AppError("Something went wrong please login again!", 404));
  }
  const updateAll = await AppNotification.updateMany(
    { role: req.user.role },
    { seen: true }
  );

  res.json(updateAll.nModified);
});

const deleteAll = catchAsync(async (req: any, res: any, next: any) => {
  const { user } = req;
  if (!user) {
    return next(new AppError("Something went wrong please login again!", 404));
  }
  const deleted = await AppNotification.deleteMany({
    id: { $in: req.body.ids },
  });

  res.json(deleted.deletedCount);
});

export { updateNotification, markAllRead, deleteAll };
