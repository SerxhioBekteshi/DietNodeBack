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
    const doc = await Model.findOne({ id: req.params.id });

    if (doc) {
      // Use the remove() method to delete the document
      doc.remove((err: any) => {
        if (err) {
          return next(new AppError("Error deleting document", 404));
        } else {
          res.status(200).json({
            message: `Record succesfully deleted.`,
          });
        }
      });
    } else {
      return next(new AppError("No document found with that id", 404));
    }
  });

const createOne = (Model: any) =>
  catchAsync(async (req: any, res: any) => {
    // const columns = Object.keys(Model.schema.paths);
    // console.log(columns);
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
    const user = await Model.findById({ _id: req.user._id });
    res.status(200).send(user);
  });

// create middleware with this code
const check = async (user, Model, id) => {
  const modelInEdit: any = await Model.findOne({ id: id });
  if (modelInEdit.providerId !== user.id) return false;
  return true;

  // const modelInEdit: any = await Model.findOne({ _id: id });
  // if (Model.collection.name === "customers") {
  // return (user.customer.toString() === id.toString() && user.role === eRoles.Admin);
  // }
  // return modelInEdit.customer.toString() === user.customer.toString();
};
const updateOne = (Model: any) =>
  catchAsync(async (req: any, res: any, next: any) => {
    const hasPermission = await check(req.user, Model, req.params.id);
    if (true) {
      // TODO: Discuss possilble combinations where pw can be changed
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
      }
      if (isObjEmpty(req.body)) {
        return next(
          new AppError("There are no data for updating the doc.", 400)
        );
      }

      const doc = await Model.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        {
          new: true,
          // runValidators allow validations that are inserted to schema of the model
          runValidators: true,
        }
      );
      if (!doc) {
        return next(new AppError("No doc find with that id", 404));
      }
      return res.status(200).json({ doc: doc, message: "Update successfully" });
    }
    // return next(new AppError("You do not have rights for access!", 400));
  });

export { deleteOne, createOne, getAll, getOne, updateOne, getUserByTokenId };
