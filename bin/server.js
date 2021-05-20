const app = require("../Server");
const dataBase = require("../model/db");

const PORT = process.env.PORT || 4040;

dataBase
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message:${err.message}`);
    process.exit(1);
  });
