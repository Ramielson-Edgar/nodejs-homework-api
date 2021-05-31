const { Schema, SchemaTypes, model } = require("mongoose");
const { messages } = require("../../helpers/constants");
const mongoosePaginate = require("mongoose-paginate-v2");

const contactsShema = new Schema(
  {
    name: {
      type: String,
      required: [true, messages.SET_CONTACT_NAME],
      minlength: 2,
      maxlength: 20,
    },
    email: {
      type: String,
      minlength: 10,
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
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

contactsShema.path("name").validate((value) => {
  const re = /[A-Z]\w+/;
  return re.test(String(value));
});

contactsShema.plugin(mongoosePaginate);

const Contact = model("contact", contactsShema);

module.exports = Contact;
