import * as debug from "debug";

class RecommendationModule {
  isClosing: boolean;
  intervalManager: any;
  intervalDuration: any;

  constructor() {
    this.isClosing = false;
    // this.intervalManager = new IntervalManager();
    this.intervalDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  start() {
    debug("Start RecommendationModule");
    this.intervalManager.add(this, this.run, 1);
    return Promise.resolve();
  }

  stop() {
    this.isClosing = true;
    this.intervalManager.removeAll();

    return this.checkClose();
  }

  checkClose() {
    //check close HERE MIGHT DO THE CALL TO SEE IF USER HAS DEACTIVATE THE OPTION FOR ONLINE RECOMMENDATION
    // debug("this.processUser", this.processUser);
    // const waitASec = (sec: any) => {
    //   return new Promise((resolve) => {
    //     setTimeout(() => resolve(), sec * 1000);
    //   });
    // };
    // const canClose = () => {
    //   return new Promise((resolve) => {
    //     resolve(this.processUser <= 0);
    //   }).then((iHaveEnded) => {
    //     if (iHaveEnded) {
    //       return true;
    //     } else {
    //       return waitASec(5).then(() => canClose());
    //     }
    //   });
    // };
    // return canClose();
  }

  run() {
    if (this.isClosing) {
      debug("run isClosing");
      return;
    }
  }

  async fetchRecommendations() {
    // Implement logic to fetch recommendations from an external service
    // For demonstration, let's simulate fetching recommendations
    // const response = await axios.get('https://api.example.com/recommendations');
    // return response.data;
  }
}

module.exports = RecommendationModule;
