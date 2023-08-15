import { catchAsync } from "./../utils/catchAsync";
import { AppError } from "../utils/appError";
import { APIFeatures } from "../utils/apiFeatures";
import bcrypt from "bcryptjs";
import { eRoles } from "../enums";
import { isObjEmpty } from "../utils";
import { Model } from "mongoose";
import { IUser } from "../interfaces/database";

// TODO: fix any types
const deleteOne = (Model: any) =>
  catchAsync(async (req: any, res: any, next: any) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }

    res.status(200).json({
      message: `Record succesfully deleted.`,
    });
  });

const createOne = (Model: any) =>
  catchAsync(async (req: any, res: any) => {
    const doc = await Model.create(req.body);
    res.status(200).json(doc);
  });

const getAll = (Model: any) =>
  catchAsync(async (req: any, res: any, next: any) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFiels()
      .pagination();

    const doc = await features.query;

    res.status(200).json(doc);
  });

const getOne = (Model: any, popOptions?: any) =>
  catchAsync(async (req: any, res: any, next: any) => {
    let query = Model.findById(req.params.id).select("-__v");
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No doc find with that id", 404));
    }

    res.status(200).json(doc);
  });

const getUserByTokenId = (Model: Model<IUser, {}, {}>, popOptions?: any) =>
  catchAsync(async (req: any, res: any, next: any) => {
    const user = await Model.aggregate([
      {
        $lookup: {
          from: "sth",
          // from: Customer.collection.name,
          localField: "customer",
          foreignField: "_id",
          as: "customers",
        },
      },
      {
        $match: { _id: { $eq: req.user._id } },
      },
      {
        $addFields: {
          customerDetails: { $arrayElemAt: ["$customers", 0] },
        },
      },
      {
        $limit: 1,
      },
    ]);
    if (!user || user.length === 0) {
      return next(new AppError("No doc find with that id", 404));
    }

    res.status(200).send(user[0]);
  });

// create middleware with this code
const check = async (user, Model, id) => {
  const modelInEdit: any = await Model.findOne({ _id: id });
  if (Model.collection.name === "customers") {
    return (
      user.customer.toString() === id.toString() && user.role === eRoles.Admin
    );
  }
  return modelInEdit.customer.toString() === user.customer.toString();
};
const updateOne = (Model: any) =>
  catchAsync(async (req: any, res: any, next: any) => {
    const hasPermission = await check(req.user, Model, req.params.id);
    if (req.user._id.toString() == req.params.id.toString() || hasPermission) {
      // TODO: Discuss possilble combinations where pw can be changed
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
      }
      if (isObjEmpty(req.body)) {
        return next(
          new AppError("There are no data for updating the doc.", 400)
        );
      }

      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        // runValidators allow validations that are inserted to schema of the model
        runValidators: true,
      });

      if (!doc) {
        return next(new AppError("No doc find with that id", 404));
      }

      return res.status(200).json(doc);
    }

    return next(new AppError("You do not have rights for access!", 400));
  });

export { deleteOne, createOne, getAll, getOne, updateOne, getUserByTokenId };
