import { EventEmitter } from "events";
import process from "process";
import log from "../src/utils/log";
import util from "util";
const debug = util.debuglog("debug");

class ProcessHandler {
  app: any;

  constructor(
    __class: any,
    options: {
      configureCustomEventsCallback?: (app: any, process: any) => void;
    } = {}
  ) {
    this.app = __class;

    this.configureEvents();
    if (options.configureCustomEventsCallback) {
      options.configureCustomEventsCallback(this.app, process);
    }
  }

  start() {
    // TODO: Check if class has method start
    // Some classes return promises other objects.
    // This is not ideal and should be standardized
    this.app
      .start()
      .then(() => {
        debug(`${this.app.constructor.name} started`);
        log.warn(`${this.app.constructor.name} started`);
      })
      .catch((err: any) => {
        this.exit(err);
      });
  }

  configureEvents() {
    process.on("uncaughtException", (err: any) => {
      this.exit(err);
    });

    process.on("unhandledRejection", (err: any) => {
      this.exit(err);
    });

    // SIGINT  = ctrl+c
    process.on("SIGINT", () => {
      this.exit("SIGINT");
    });

    // SIGTERM = childProcess.kill()
    process.on("SIGTERM", () => {
      this.exit("SIGTERM");
    });

    if (this.app.prototype instanceof EventEmitter) {
      this.app.on("genericError", (err: any) => {
        if (err instanceof Object) {
          log.error({ err });
        } else {
          log.error(err);
        }
      });

      this.app.on("info", (info: any) => {
        log.info(info);
      });
    }
  }

  exit(msg: any) {
    debug(msg);
    log.warn(`Exiting process ${this.app.constructor.name} - ${msg}`);
    if (msg instanceof Object) {
      log.fatal({ msg });
    } else {
      log.fatal(msg);
    }
    this.app
      .stop()
      .then(() => {
        process.exit();
      })
      .catch((error: any) => {
        debug(`error ${error}`);
        log.error({
          func: `${this.app.constructor.name}.stop()`,
          error,
        });
        process.exit();
      });
  }
}

export = ProcessHandler;
