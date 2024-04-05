// TODO: Fix any Types
const catchAsync = (fn: any) => {
  return (req: any, res: any, next: any) => {
    fn(req, res, next).catch(next);
  };
};
//maybeee
// return (req: any, res: any, next: any) => {
//   Promise.resolve(fn(req, res, next)).catch((err: any) => {
//     next(err);
//   });
// };
export { catchAsync };
