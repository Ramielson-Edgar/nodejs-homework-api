const Joi = require("joi");
const { httpStatusCode } = require("../helpers/statusCode");

const schemaCreatContacts = Joi.object({
  name: Joi.string().min(10).max(20).required(),
  phone: Joi.string().min(8).max(11).required(),
  email: Joi.string()
    .min(5)
    .max(11)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

const schemaUpdateContacts = Joi.object({
  name: Joi.string().min(10).max(20).optional(),
  phone: Joi.string().min(8).max(11).optional(),
  email: Joi.string()
    .min(5)
    .max(11)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .optional(),
});

const validate = (shema, body, next) => {
  const { error } = shema.validate(body);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: httpStatusCode.BAD_REQUEST,
      code: httpStatusCode.BAD_REQUEST,
      message: `Faild: ${message.replace(/"/g, "")}`,
      data: "Bad Request",
    });
  }
  next();
};

module.exports.validateCreat = (req, res, next) => {
  return validate(schemaCreatContacts, req.body, next);
};

module.exports.validateUpdate = (req, res, next) => {
  return validate(schemaUpdateContacts, req.body, next);
};
