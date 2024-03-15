import RecommendationModule from "../src/modules/recommendationModule";
import ProcessHandler from "./processHandler";

const app = new RecommendationModule();
new ProcessHandler(app).start();
