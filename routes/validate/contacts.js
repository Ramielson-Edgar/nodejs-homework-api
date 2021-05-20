const Joi = require("joi");
const mongoose = require("mongoose");
const { httpStatusCode, messages } = require("../../helpers/constants");

const schemaQueryContacts = Joi.object({
  sortBy: Joi.string().valid("name", "email", "phone", "id").optional(),
  sortByDesc: Joi.string().valid("name", "email", "phone", "id").optional(),
  filter: Joi.string().valid("favorite").optional(),
  limit: Joi.number().min(1).max(20).optional(),
  page: Joi.number().min(0).optional(),
  favorite: Joi.boolean().optional(),
}).without("sortBy", "sortByDesc");

const schemaCreatContacts = Joi.object({
  name: Joi.string().min(10).max(20).required(),
  phone: Joi.string().min(8).max(11).required(),
  email: Joi.string()
    .min(10)
    .max(20)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  favorite: Joi.boolean().optional(),
});

const schemaUpdateContacts = Joi.object({
  name: Joi.string().min(10).max(20).optional(),
  phone: Joi.string().min(8).max(11).optional(),
  email: Joi.string()
    .min(10)
    .max(20)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .optional(),
  favorite: Joi.boolean().optional(),
});

const schemaUpdateContactsStatus = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = (shema, body, next) => {
  const { error } = shema.validate(body);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: httpStatusCode.BAD_REQUEST,
      code: httpStatusCode.BAD_REQUEST,
      message: `${messages.FAILD}: ${message.replace(/"/g, "")}`,
      data: messages.BAD_REQUEST,
    });
  }
  next();
};

module.exports.validateQueryContacts = (req, _, next) => {
  return validate(schemaQueryContacts, req.query, next);
};

module.exports.validateCreat = (req, _, next) => {
  return validate(schemaCreatContacts, req.body, next);
};

module.exports.validateUpdate = (req, _, next) => {
  return validate(schemaUpdateContacts, req.body, next);
};

module.exports.validateUpdateStatus = (req, _, next) => {
  return validate(schemaUpdateContactsStatus, req.body, next);
};

module.exports.validateObjectId = (req, _, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
    return next({
      status: httpStatusCode.BAD_REQUEST,
      message: messages.INVALID_OBJECT_ID,
    });
  }
  next();
};
