const sendgrid = require("@sendgrid/mail");
require("dotenv").config();
const Mailgen = require("mailgen");

class EmailService {
  #sender = sendgrid;
  #GenerateTemplate = Mailgen;
  constructor(env) {
    switch (env) {
      case "development":
        this.link = "http://localhost:3000";
        break;

      case "production":
        this.link = "link for production";
        break;

      default:
        this.link = "http://localhost:3000";
        break;
    }
  }

  #creatTemplateVerifyEmail(verifyToken, email) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: "cerberus",
      product: {
        name: "PhoneBook",
        link: this.link,
      },
    });

    const emailMsg = {
      body: {
        name: email,
        intro: "Welcome to PhoneBook! We're very excited to have you on board.",
        action: {
          instructions: "To get started with PhoneBook, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    };

    const emailBody = mailGenerator.generate(emailMsg);
    console.log(emailBody);
    return emailBody;
  }

  async sendVerifyEmail(verifyToken, email) {
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: "jurirulez@gmail.com",
      subject: "verify Email",
      html: this.#creatTemplateVerifyEmail(verifyToken, email),
    };

    this.#sender.send(msg);
  }
}

module.exports = EmailService;
