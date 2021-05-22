const { MongoClient } = require("mongodb");
require("dotenv").config();
const uriDb = process.env.DB_HOST;

const db = MongoClient.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 5,
});

db.then(() => {
  console.log(`Database connection successful`);
}).catch((error) => {
  if (error) {
    console.log(`Something went wrong:${error.message}`);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  const client = await db;
  client.close();
  console.log("Error disconnected from server");
  process.exit(1);
});

module.exports = db;
