"use strict";

const SmsWriteQOS = require("../src/serversmpp/modules/sms/writeQOS");
import RecommendationModule from "../src/modules/recommendationModule";
import ProcessHandler from "./processHandler";

const app = new RecommendationModule();
new ProcessHandler(app).start();
