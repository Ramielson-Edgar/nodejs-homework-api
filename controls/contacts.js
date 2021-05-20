const { httpStatusCode, messages } = require("../helpers/constants");
const { ContactsServices } = require("../services");
const contactsServices = new ContactsServices();
const wrap = require("../helpers/handleError");

const getListContacts = wrap(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await contactsServices.getContacts(userId, req.query);
    return res.status(httpStatusCode.ok).json({
      status: messages.SUCCESS,
      code: httpStatusCode.ok,
      data: {
        list,
      },
    });
  } catch (e) {
    next(e);
  }
});

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const response = await contactsServices.getById(
      userId,
      req.params.contactId
    );
    if (response) {
      res.status(httpStatusCode.ok).json({
        status: messages.SUCCESS,
        code: httpStatusCode.ok,
        data: {
          ...response,
        },
      });
    } else {
      res.status(httpStatusCode.NOT_FOUND).json({
        status: messages.ERROR,
        code: httpStatusCode.NOT_FOUND,
        message: messages.NOT_FOUND,
      });
    }
  } catch (e) {
    next(e);
  }
};

const creat = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await contactsServices.creatContact(userId, req.body);
    return res.status(httpStatusCode.CREATED).json({
      status: messages.SUCCESS,
      code: httpStatusCode.CREATED,
      data: { response },
    });
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await contactsServices.update(
      userId,
      req.params.contactId,
      req.body
    );

    if (response) {
      return res.status(httpStatusCode.ok).json({
        status: messages.SUCCESS,
        code: httpStatusCode.ok,
        data: { response },
      });
    }

    res.status(httpStatusCode.BAD_REQUEST).json({
      status: messages.ERROR,
      code: httpStatusCode.BAD_REQUEST,
      message: messages.NOT_FOUND,
    });
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    return await contactsServices
      .remove(userId, req.params.contactId)
      .then((data) => {
        if (data) {
          res.status(httpStatusCode.ok).json({
            status: messages.SUCCESS,
            code: httpStatusCode.ok,
            message: messages.SUCCESS_DELETE,
            data: { data },
          });
        } else {
          return res.status(httpStatusCode.NOT_FOUND).json({
            status: messages.ERROR,
            code: httpStatusCode.NOT_FOUND,
            message: messages.NOT_FOUND,
          });
        }
      });
  } catch (e) {
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await contactsServices.updateStatus(
      userId,
      req.params.contactId,
      req.body
    );

    if (response) {
      return res.status(httpStatusCode.ok).json({
        status: messages.SUCCESS,
        code: httpStatusCode.ok,
        data: { ...response },
      });
    } else {
      res.status(httpStatusCode.BAD_REQUEST).json({
        status: messages.ERROR,
        code: httpStatusCode.BAD_REQUEST,
        message: messages.NOT_FOUND,
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
