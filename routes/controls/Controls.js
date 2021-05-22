const { httpStatusCode } = require("../helpers/statusCode");
const { ContactsServices } = require("../services");
const contactsServices = new ContactsServices();

const getListContacts = async (req, res, next) => {
  try {
    const list = await contactsServices.getContacts();
    return res.status(httpStatusCode.ok).json({
      status: "success",
      code: httpStatusCode.ok,
      data: {
        list,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const response = await contactsServices.getById(req.params.contactId);

    if (response) {
      res.status(httpStatusCode.ok).json({
        status: "success",
        code: httpStatusCode.ok,
        data: {
          ...response,
        },
      });
    } else {
      res.status(httpStatusCode.NOT_FOUND).json({
        status: "Error",
        code: httpStatusCode.NOT_FOUND,
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const creat = async (req, res, next) => {
  try {
    const response = await contactsServices.creatContact(req.body);
    return res.status(httpStatusCode.CREATED).json({
      status: "success",
      code: httpStatusCode.CREATED,
      data: { ...response },
    });
  } catch (e) {
    next(e);
  }
};
;

const updateContact = async (req, res, next) => {
  try {
    const response = await contactsServices.update(
      req.params.contactId,
      req.body
    );

    if (response) {
      return res.status(httpStatusCode.ok).json({
        status: "Update success",
        code: httpStatusCode.ok,
        data: { response },
      });
    }

    res.status(httpStatusCode.BAD_REQUEST).json({
      status: "Error",
      code: httpStatusCode.BAD_REQUEST,
      message: "Not found",
    });
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const response = await contactsServices.remove(req.params.contactId);

    if (!response) {
      res.status(httpStatusCode.NOT_FOUND).json({
        status: "Error",
        code: httpStatusCode.NOT_FOUND,
        message: "Not Found",
      });
    }

    return res.status(httpStatusCode.ok).json({
      status: "success",
      code: httpStatusCode.ok,
      message: "contact deleted",
      data: { ...response },
    });
  } catch (e) {
    next(e);
  }
};

 
const updateStatusContact = async (req, res, next) => {
  try {
    const response = await contactsServices.updateStatus(
      req.params.contactId,
      req.body
    );

    if (response) {
      return res.status(httpStatusCode.ok).json({
        status: "Update success",
        code: httpStatusCode.ok,
        data: { ...response },
      });
    } else {
      res.status(httpStatusCode.BAD_REQUEST).json({
        status: "Error",
        code: httpStatusCode.BAD_REQUEST,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

 
module.exports = {
  getListContacts,
  getContactById,
  creat,
  updateContact,
  removeContact,
  updateStatusContact,
};
