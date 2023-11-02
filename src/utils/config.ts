const stripe = require("stripe");

const apiKey =
  "pk_test_51LgoxpAY8j8tNCkQWxR63hXKmIvlup6fOSMb4KYwxlG5JsP2WNfqpsx13DVKseqZ0cZoXKCwVGSCtMdWRoVXIjd300uBllqaUf";
const secretKey =
  "sk_test_51LgoxpAY8j8tNCkQ8sDMAaArXom9m5fEqaokLW4kjJWiWdWoauXoLThmuEdlTBr7XS1dtET6VUDMXKX67CCLWl6J008Y9Vnvzc";

stripe.setApiKey(apiKey, secretKey);

module.exports = stripe;
