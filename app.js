const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const boolParser = require("express-query-boolean");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();

const { httpStatusCode, messages } = require("./helpers/constants");

const userRouter = require("./routes/user");
const contactsRouter = require("./routes/contacts");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(express.static("public"));
app.use(logger(formatsLogger));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => {
    res.status(httpStatusCode.TOO_MANY_REQUESTS).json({
      status: messages.ERROR,
      code: httpStatusCode.TOO_MANY_REQUESTS,
      message: messages.TOO_MANY_REQUEST,
    });
  },
});

app.use(limiter);
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: httpStatusCode.NO_CONTENT,
  })
);

app.use(express.json());
app.use(boolParser());

app.use("/users", userRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
  res.status(httpStatusCode.BAD_REQUEST).json({
    status: messages.ERROR,
    code: httpStatusCode.BAD_REQUEST,
    message: `${messages.WRONG_ROUTE} ${req.baseUrl}`,
    data: messages.NOT_FOUND,
  });
});

app.use((err, req, res, next) => {
  const error = err.status ? err.status : httpStatusCode.INTERNAL_SERVER_ERROR;
  res.status(error).json({
    status:
      error === httpStatusCode.INTERNAL_SERVER_ERROR
        ? messages.FAILD
        : messages.ERROR,
    code: error,
    message: err.message,
    data:
      error === httpStatusCode.INTERNAL_SERVER_ERROR
        ? httpStatusCode.INTERNAL_SERVER_ERROR
        : err.data,
  });
});

module.exports = app;
