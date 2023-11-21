export enum eColumnType {
  Number,
  String,
  DateTime,
  Decimal,
  Boolean,
  Icons,
  Link,
  DateOnly,
  Actions,
  Select,
  Tags,
  Image,
}

export enum eFilterOperator {
  Contain,
  StartWith,
  EndWith,
  Equal,
  Different,
  LessThan,
  LessOrEqual,
  GreaterThan,
  GreaterOrEqual,
  Between,
}
export enum eSortType {
  Asc,
  Desc,
}

export enum eRoles {
  Admin = "Admin",
  Provider = "Provider",
  User = "User",
}

export enum eSocketEvent {
  ReadComments = "read-comments",
  OnReadComments = "on-read-comments",
  UpdateComments = "UpdateComments",
  TimeOffTableUpdated = "TimeOffTableUpdated",
  LeaveRoom = "leave-room",
  JoinRoom = "join-room",
  Disconnect = "disconnect",
}

export enum ePaymentMethod {
  Stripe = "Stripe",
  Paypal = "Paypal",
}

export enum eOrderStatus {
  Completed = "Completed",
  Rejected = "Rejected",
  Pending = "Pending",
}
