const path = require("path");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
require("dotenv").config();
const { httpStatusCode, messages, folder } = require("../helpers/constants");
const { UserRepositories } = require("../model");
const userRepositories = new UserRepositories();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userRepositories.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      res.status(httpStatusCode.UNAUTHORIZATION).json({
        status: messages.ERROR,
        code: httpStatusCode.UNAUTHORIZATION,
        messages: messages.EMAIL_OR_PASSWORD_WRONG,
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
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const registration = async (req, res, next) => {
  const { email } = req.body;
  const newUser = await userRepositories.findByEmail(email);

  if (newUser) {
    return res.status(httpStatusCode.CONFLICT).json({
      status: messages.CONFLICT,
      message: messages.EMAIL_IN_USE,
    });
  }

  try {
    const user = await userRepositories.create(req.body);

    return res.status(httpStatusCode.CREATED).json({
      status: messages.SUCCESS_CREATED,
      code: httpStatusCode.CREATED,
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        avatar: user.avatarUrl,
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
  await userRepositories.updateUserAvatar(id, avatarUrl);

  return res.status(httpStatusCode.ok).json({
    status: messages.SUCCESS,
    code: httpStatusCode.ok,
    message: messages.SUCCESS_UPDATE,
    data: { avatarUrl },
  });
};

const saveAvatar = async (req) => {
  const FOLDER_AVATAR = process.env.FOLDER_AVATAR;
  const pathfile = req.file.path;

  const newNname = `${Date.now().toString()}-${req.file.originalname}`;
  const img = await Jimp.read(pathfile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathfile);

  try {
    await fs.rename(
      pathfile,
      path.join(process.cwd(), folder.PUBLIC, FOLDER_AVATAR, newNname)
    );
  } catch (e) {
    await fs.unlink(pathfile);
    return console.log(e.message);
  }

  const oldAvatarUrl = req.user.avatarUrl;

  if (String(oldAvatarUrl).includes(`${FOLDER_AVATAR}/`)) {
    await fs.unlink(path.join(process.cwd(), folder.PUBLIC, oldAvatarUrl));
  }

  return path.join(FOLDER_AVATAR, newNname).replace("\\", "/");
};

module.exports = {
  registration,
  login,
  logout,
  current,
  updateUserSubscription,
  updateAvatar,
  saveAvatar,
};
