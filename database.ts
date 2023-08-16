import { connect } from "mongoose";

const initialize = async () => {
  const DB =
    "mongodb+srv://serxhio:Serxhio12345.@cluster0.tkqmazt.mongodb.net/dietRepo?retryWrites=true&w=majority";

  let connection = await connect(DB);

  if (connection) console.log("Database is connected...");
};
export default { initialize };
