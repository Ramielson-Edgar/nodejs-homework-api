const app = require("../Server");
const dataBase = require("../model/db");
const { database } = require("../helpers/constants");

const PORT = process.env.PORT || 3000;

dataBase
  .then(() => {
    app.listen(PORT, () => {
      console.log(`${database.SERVER_RUNNING}: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`${database.SERVER_ERROR}:${err.message}`);
    process.exit(1);
  });
