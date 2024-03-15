  {
      "name": "notification",
      "script": "processes/notification.ts",
      "kill_timeout": 15000,
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
      "args": [],
      "watch": false,
      "ignore_watch": ["node_modules", "log", "test", "tmp"],
      "merge_logs": true,
      "cwd": "./",
      "instances": 1,
      "exec_mode": "cluster",
      "error_file": "./log/notification-err.log",
      "out_file": "./log/notification-out.log",
      "env": {
        "NODE_ENV": "development",
        "NODE_DEBUG": "debug",
        "IS_TLS": "false"
      },
      "pid_file": "./tmp/notification.pid"
    },
    {
      "name": "mainEntry",
      "script": "processes/mainEntry.js",
      "kill_timeout": 15000,
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
      "args": [],
      "watch": false,
      "ignore_watch": ["node_modules", "log", "test", "tmp"],
      "merge_logs": true,
      "cwd": "./",
      "instances": 1,
      "exec_mode": "fork",
      "error_file": "./log/mainEntry-err.log",
      "out_file": "./log/mainEntry-out.log",
      "env": {
        "NODE_ENV": "development",
        "NODE_DEBUG": "debug",
        "IS_TLS": "true"
      },
      "pid_file": "./tmp/mainEntry.pid"
    }