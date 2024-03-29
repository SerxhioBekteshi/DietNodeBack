import { getAutoGeneratedPassword } from "../../utils";

const assignTo = async (req: any, res: any, next: any) => {
  if (!req.body.assignedTo) {
    req.body.assignedTo = req.user._id;
  }
  const password = getAutoGeneratedPassword();
  req.body.password = password;
  req.body.passwordConfirm = password;
  req.body.customer = req.user.customer;
  req.body.createdBy = req.user._id;
  next();
};

export { assignTo };
