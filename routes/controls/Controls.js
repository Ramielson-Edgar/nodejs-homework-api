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
          response,
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
    const { name, email, phone } = req.body;

    return contactsServices.creatContact(name, email, phone).then((data) => {
      res.status(httpStatusCode.CREATED).json({
        status: "success",
        code: httpStatusCode.CREATED,
        data: { data },
      });
    });
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { contactId } = req.params;

    const response = await contactsServices.update(
      contactId,
      name,
      email,
      phone
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
    const { contactId } = req.params;
    return await contactsServices.remove(contactId).then((data) => {
      if (data) {
        res.status(httpStatusCode.ok).json({
          status: "success",
          code: httpStatusCode.ok,
          message: "contact deleted",
          data: { data },
        });
      } else {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: "Error",
          code: httpStatusCode.NOT_FOUND,
          message: "Not Found",
        });
      }
    });
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
};
