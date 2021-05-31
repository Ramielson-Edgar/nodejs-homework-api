const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");
require("dotenv").config();

const {
  httpStatusCode,
  messages,
  staticFolder,
} = require("../helpers/constants");

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
  const newAvatarName = `${Date.now().toString()}-${req.file.originalname}`;
  const img = await jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(String(pathFile));
  try {
    await fs.rename(
      pathFile,
      path.join(
        process.cwd(),
        staticFolder.PUBLIC,
        FOLDER_AVATARS,
        newAvatarName
      )
    );
  } catch (err) {
    console.log(err.message);
  }

  const oldAvatar = req.user.avatarUrl;

  if (String(oldAvatar).includes(`${FOLDER_AVATARS}/`)) {
    try {
      await fs.unlink(path.join(process.cwd(), staticFolder.PUBLIC, oldAvatar));
    } catch (e) {
      console.log(e.meesage);
    }
  }

  return path.join(FOLDER_AVATARS, newAvatarName).replace("\\", "/");
};

module.exports = {
  registration,
  login,
  logout,
  current,
  updateUserSubscription,
  updateAvatar,
};
