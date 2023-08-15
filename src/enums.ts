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
  Tags
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
export enum eTimeOffCategory {
  Vacation = 1,
  RemoteWork,
  SickDay,
  PersonalDay,
  BereavementLeave,
  MaternityLeave,
  PaternityLeave,
  Other,
}
export enum eTimeOffStatus {
  Booked = 1,
  Rejected,
  Approved
}

export enum ePositions {
  Employee = 'Employee',
  Manager = 'Manager',
  Developer = 'Developer',
  Admin = 'Admin',

}

export enum eRoles {
  User = 'User',
  Manager = 'Manager',
  Admin = 'Admin',
}

export enum eCategory {
  General = 'General',
  Options = 'Options',
}

export enum eStatus {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  Hourly = 'Hourly',
}

export enum eAnnouncement {
  _,
  Retreat,
  Activity,
  Sports,
  Wellness,
  Test,
  Other
}

export enum eCommentStatus {
  Sent,
  Delivered,
  Seen,
}

export enum eSocketEvent {
  ReadComments = 'read-comments',
  OnReadComments = 'on-read-comments',
  UpdateComments = 'UpdateComments',
  TimeOffTableUpdated = 'TimeOffTableUpdated',
  LeaveRoom = 'leave-room',
  JoinRoom = 'join-room',
  Disconnect = 'disconnect'
}