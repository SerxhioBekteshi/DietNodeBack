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
    { user: { $eq: user._id } },
    { seen: true }
  );
  res.json(updateAll.nModified);
});
export { updateNotification, markAllRead };
