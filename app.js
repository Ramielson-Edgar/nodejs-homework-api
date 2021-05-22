const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const { httpStatusCode } = require("./routes/helpers/statusCode");

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
  res.status(httpStatusCode.BAD_REQUEST).json({
    status: "Error",
    code: httpStatusCode.BAD_REQUEST,
    message: `Use api on routes ${req.baseUrl}`,
    data: "Not Found",
  });
});

app.use((err, req, res, next) => {
  const error = err.status ? err.status : httpStatusCode.INTERNAL_SERVER_ERROR;
  res.status(error).json({
    status: error === 500 ? "Faild" : "Error",
    code: error,
    message: err.message,
    data: error === 500 ? httpStatusCode.INTERNAL_SERVER_ERROR : err.data,
  });
});

module.exports = app;
