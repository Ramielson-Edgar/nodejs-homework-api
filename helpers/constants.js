const httpStatusCode = {
  ok: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409,
  UNAUTHORIZATION: 401,
};

const signature = {
  STARTER: "starter",
  PRO: "pro",
  BUSINESS: "business",
};

const messages = {
  ERROR: "Error",
  NON_AUTHORIZED: "Not authorized",
  CONFLICT: "Conflict",
  SUCCESS: "Success",
  SUCCESS_DELETE: "Success, Deleted",
  SUCCESS_UPDATE: "Success Updated",
  SUCCESS_CREATED: "Success Created",
  EMAIL_IN_USE: "Email in use",
  EMAIL_OR_PASSWORD_WRONG: "Email or password is wrong",
  BAD_REQUEST: "Bad Request",
  NOT_FOUND: "Not found",
  FAILD: "Faild",
  WRONG_ROUTE: "Use api on routes",
  INVALID_OBJECT_ID: "Invalid Object id",
  SET_CONTACT_NAME: "Set name for contact",
  PASSWORD_IS_REQUIRE: "Password is required",
  EMAIL_IS_REQUIRE: "Email is required",
};

const connection = {
  CONNECTED: "connected",
  ERROR: "Error",
  DISCONNECTED: "disconnected",
  DATABSE_CONNECTION_SUCCESSFUL: "Database connection successful",
  MONGOOSE_ERROR: "Mongoose error",
  MONGOOSE_DISCONNECTED: "Mongoose is disconnected",
  DATABSE_CONNECTION_CLOSE: "Database connection is closed",
};

module.exports = {
  httpStatusCode,
  signature,
  messages,
  connection,
};
