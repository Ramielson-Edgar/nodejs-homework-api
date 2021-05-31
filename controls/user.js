const Jimp = require("jimp");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

const {
  httpStatusCode,
  messages,
  staticFolder,
} = require("../helpers/constants");
const { UserRepositories } = require("../model");
const userRepositories = new UserRepositories();
const EmailService = require("../services/email");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userRepositories.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword || !user.verify) {
      return res.status(httpStatusCode.UNAUTHORIZATION).json({
        status: messages.ERROR,
        code: httpStatusCode.UNAUTHORIZATION,
        messages: !user.verify
          ? messages.NOT_VERIFICATED
          : messages.EMAIL_OR_PASSWORD_WRONG,
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });

    await userRepositories.updateToken(user.id, token);
    return res.status(httpStatusCode.ok).json({
      status: messages.SUCCESS,
      code: httpStatusCode.ok,
      data: {
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
          avatar: user.avatarUrl,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const registration = async (req, res, next) => {
  const user = await userRepositories.findByEmail(req.body.email);

  if (user) {
    return res.status(httpStatusCode.CONFLICT).json({
      status: messages.CONFLICT,
      message: messages.EMAIL_IN_USE,
    });
  }

  try {
    const newUser = await userRepositories.create(req.body);
    const { id, email, password, avatarUrl, verifyTokenEmail, subscription } =
      newUser;

    try {
      const emailService = new EmailService(process.env.NODE_ENV);
      return await emailService.sendVerifyEmail(verifyTokenEmail, email);
    } catch (e) {
      console.log(e.message);
    }

    return res.status(httpStatusCode.CREATED).json({
      status: messages.SUCCESS_CREATED,
      code: httpStatusCode.CREATED,
      data: {
        id,
        email,
        password,
        avatarUrl,
        subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const userId = req.user.id;
  await userRepositories.updateToken(userId, null);
  return res.status(httpStatusCode.UNAUTHORIZATION).json({});
};

const current = async (req, res, next) => {
  try {
    const user = await userRepositories.findById(req.user.id);

    if (user) {
      return res.status(httpStatusCode.ok).json({
        status: messages.SUCCESS,
        code: httpStatusCode.ok,
        data: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    }
  } catch (e) {
    next(e);
  }
};

const updateUserSubscription = async (req, res, next) => {
  try {
    const user = await userRepositories.updateSubscription(
      req.user.id,
      req.body
    );

    if (user) {
      return res.status(httpStatusCode.ok).json({
        status: messages.SUCCESS,
        code: httpStatusCode.ok,
        message: messages.SUCCESS_UPDATE,
        data: {
          subscription: user.subscription,
        },
      });
    }
  } catch (e) {
    next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  const avatarUrl = await saveAvatar(req);
  await userRepositories.updateAvatar(id, avatarUrl);

  return res.status(httpStatusCode.ok).json({
    status: httpStatusCode.ok,
    message: messages.SUCCESS_UPDATE,
    data: { avatarUrl },
  });
};
const saveAvatar = async (req) => {
  const FOLDER_AVATARS = process.env.FOLDER_AVATARS;
  const pathFile = req.file.path;

  const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(String(pathFile));

  await fs.rename(
    pathFile,
    path.join(process.cwd(), staticFolder.PUBLIC, FOLDER_AVATARS, newNameAvatar)
  );

  const oldAvatar = req.user.avatarUrl;

  if (String(oldAvatar).includes(`${FOLDER_AVATARS}/`)) {
    try {
      return await fs.unlink(
        path.join(process.cwd(), staticFolder.PUBLIC, oldAvatar)
      );
    } catch (e) {
      console.log(e.message);
    }
  }
  return path.join(FOLDER_AVATARS, newNameAvatar).replace("\\", "/");
};

const verify = async (req, res, next) => {
  try {
    const user = await userRepositories.findByVerifyTokenEmail(
      req.params.token
    );

    if (user) {
      await userRepositories.updateVerifyToken(user.id, true, null);

      return res.status(httpStatusCode.ok).json({
        status: messages.SUCCESS,
        code: httpStatusCode.ok,
        message: messages.VERIFICATION_SUCCESS,
      });
    }

    return res.status(httpStatusCode.BAD_REQUEST).json({
      status: messages.ERROR,
      code: httpStatusCode.BAD_REQUEST,
      messages: messages.NOT_FOUND,
    });
  } catch (e) {
    next(e);
  }
};

const repeatEmailVerify = async (req, res, next) => {
  try {
    const user = await userRepositories.findByEmail(req.body.email);

    if (user) {
      const { verifyTokenEmail, email } = user;
      const emailService = new EmailService(process.env.NODE_ENV);
      await emailService.sendVerifyEmail(verifyTokenEmail, email);

      return res.status(httpStatusCode.ok).json({
        status: messages.SUCCESS,
        code: httpStatusCode.ok,
        message: messages.VERIFICATION_EMAIL_SENT,
        data: { email: email },
      });
    }

    return res.status(httpStatusCode.NOT_FOUND).json({
      status: messages.ERROR,
      code: httpStatusCode.NOT_FOUND,
      messages: messages.NOT_FOUND,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  registration,
  login,
  logout,
  current,
  updateUserSubscription,
  updateAvatar,
  verify,
  repeatEmailVerify,
};
