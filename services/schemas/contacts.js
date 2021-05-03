const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contacts = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
    minlength: 2,
    maxlength: 70,
  },
  email: {
    type: String,
    minlength: 20,
    maxlength: 70,
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 15,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  // { versionKey: false, timestamps: true }
});

const Contact = mongoose.model("contact", contacts);

module.exports = Contact;
