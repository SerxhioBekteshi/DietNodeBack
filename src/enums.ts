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
}
export enum eSortType {
  Asc,
  Desc,
}

export enum eRoles {
  User = "User",
  Manager = "Manager",
  Admin = "Admin",
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
