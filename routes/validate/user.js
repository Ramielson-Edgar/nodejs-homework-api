const Joi = require("joi");
const {
  httpStatusCode,
  signature,
  messages,
} = require("../../helpers/constants");

const schemaCreatUser = Joi.object({
  email: Joi.string()
    .min(5)
    .max(20)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  password: Joi.string().required(),
  repeat_password: Joi.ref("password"),
  access_token: Joi.string().optional(),
  subscription: Joi.string(),
});

const schemaUpdateSubcsriptionUser = Joi.object({
  subscription: Joi.string()
    .valid(signature.BUSINESS, signature.PRO, signature.STARTER)
    .optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .min(5)
    .max(20)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  password: Joi.string().required(),
  repeat_password: Joi.ref("password"),
  access_token: Joi.string().optional(),
  subscription: Joi.string(),
});

const validate = (shema, body, next) => {
  const { error } = shema.validate(body);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: httpStatusCode.BAD_REQUEST,
      code: httpStatusCode.BAD_REQUEST,
      message: `Faild: ${message.replace(/"/g, "")}`,
      data: messages.BAD_REQUEST,
    });
  }
  next();
};

module.exports.validateCreat = (req, res, next) => {
  return validate(schemaCreatUser, req.body, next);
};

module.exports.validateLogin = (req, res, next) => {
  return validate(schemaLoginUser, req.body, next);
};

module.exports.validateUpdateSubscription = (req, res, next) => {
  return validate(schemaUpdateSubcsriptionUser, req.body, next);
};
