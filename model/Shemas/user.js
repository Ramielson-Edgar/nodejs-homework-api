const { Schema, model } = require("mongoose");
const { signature, messages } = require("../../helpers/constants");
const { genSalt, hash, compare } = require("bcryptjs");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const userShema = new Schema(
  {
    password: {
      type: String,
      required: [true, messages.PASSWORD_IS_REQUIRE],
    },
    email: {
      type: String,
      required: [true, messages.EMAIL_IS_REQUIRE],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: { values: [signature.BUSINESS, signature.PRO, signature.STARTER] },
      default: signature.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: "250" }, true);
      },
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyTokenEmail: {
      type: String,
      require: true,
      default: nanoid(),
      required: [true, "Verify token is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userShema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await genSalt(6);
    this.password = await hash(this.password, salt);
  }
  next();
});

userShema.methods.validPassword = async function (password) {
  return await compare(password, this.password);
};

const User = model("user", userShema);

module.exports = User;
