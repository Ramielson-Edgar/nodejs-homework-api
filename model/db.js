const mongoose = require("mongoose");
const { connection } = require("../helpers/constants");
require("dotenv").config();
const uriDb = process.env.DB_URI;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 5,
});

mongoose.connection.on(connection.CONNECTED, () => {
  console.log(connection.DATABSE_CONNECTION_SUCCESSFUL);
});
mongoose.connection.on(connection.ERROR, (err) => {
  console.log(`${connection.MONGOOSE_ERROR}${err.message}`);
  process.exit(1);
});

mongoose.connection.on(connection.DISCONNECTED, () => {
  console.log(connection.MONGOOSE_DISCONNECTED);
});

process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log(connection.DATABSE_CONNECTION_CLOSE);
    process.exit(1);
  });
});

module.exports = db;
