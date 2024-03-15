import util from "util";
import cron from "node-cron";
const debug = util.debuglog("debug");

class RecommendationModule {
  isClosing: boolean;
  // intervalManager: any;
  intervalDuration: any;

  constructor() {
    this.isClosing = false;
    // this.intervalManager = new IntervalManager();
    this.scheduleTasks();
    this.intervalDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  start() {
    debug("Start RecommendationModule");
    // this.intervalManager.add(this, this.run, 1);
    return Promise.resolve();
  }

  stop() {
    this.isClosing = true;
    // this.intervalManager.removeAll();
  }

  run() {
    if (this.isClosing) {
      debug("run isClosing");
      return;
    }
  }

  private scheduleTasks() {
    cron.schedule("0 10 * * *", () => {
      this.fetchMeals("morning");
    });

    cron.schedule("0 14 * * *", () => {
      this.fetchMeals("lunch");
    });

    cron.schedule("0 20 * * *", () => {
      this.fetchMeals("dinner");
    });
  }

  private fetchMeals(time: string) {
    // Logic to fetch meals from external API
    // Example:
    // axios.get('http://external-api.com/meals')
    //   .then(response => {
    //     // Process meals
    //   })
    //   .catch(error => {
    //     console.error('Error fetching meals:', error);
    //   });

    // Replace the above with your actual logic
    console.log(`Fetching ${time} meals from external API...`);
    //AT THIS MOMENT I MIGHT USE REDIS TO STORE THE DATA AND LISTEN TO AN ENDPOINT FOR IT TO GET THE DATA
  }
}

export = RecommendationModule;
