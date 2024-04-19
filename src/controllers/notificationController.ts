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

const markAsRead = catchAsync(async (req: any, res: any, next: any) => {
  const existingNotification = await AppNotification.findOne({
    id: req.params.id,
  });

  if (!existingNotification) {
    return next(new AppError("This notification does not exist"), 400);
  }

  const updateNotification = await AppNotification.updateOne(
    { id: req.params.id },
    { seen: true }
  );

  res.json(updateNotification);
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

export { updateNotification, markAllRead, deleteAll, markAsRead };
