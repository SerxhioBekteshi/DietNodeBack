import { IUser } from "../../interfaces/database";
import nodemailer from "nodemailer";
import pug from "pug";

class Email {
  to: string;
  url: string;
  from: string;
  user: IUser;
  creator: IUser;
  cc: string;

  constructor(user: IUser | any, creator?: IUser) {
    this.creator = creator;
    this.to = typeof user === "object" ? user.email : user;
    this.from = `<${process.env.EMAIL_FROM}>`;
    this.cc = process.env.EMAIL_CC;
    this.user = user;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_FROM_PW,
      },
    });
  }
  // Send the actual email
  async send(template: string, subject: string, payload?: any) {
    const html = pug.renderFile(
      `${__dirname}/templates/${template}Template.pug`,
      payload
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      cc: payload.cc,
      subject,
      html,
    };

    return await this.newTransport().sendMail(mailOptions);
  }

  async sendRegister() {
    await this.send("register", "Welcome to Serxhio Test!", {
      email: this.user.email,
      name: `${this.user.name} ${this.user.lastName}`,
      admin: `${this.creator.name} ${this.creator.lastName}`,
      password: this.user.password,
    });
  }

  async registerAuth(token: string) {
    await this.send("welcome", "Authorization Serxhio Project", {
      url: `${process.env.WEBPAGE_URL}confirm?token=${token}`,
      name: `${this.user.name} ${this.user.lastName}`,
    });
  }

  async sendEmailTemplateToRegister(token: string) {
    await this.send("emailToRegister", "Provider Registration process", {
      url: `${process.env.WEBPAGE_URL}?hashData=${token}`,
      email: this.to,
    });
  }

  async sendPasswordReset(token: string) {
    await this.send(
      "forgotpassword",
      "Your password reset token (valid for only 10 minutes)",
      {
        url: `${process.env.WEBPAGE_URL}resetpassword?token=${token}`,
        name: `${this.user.name} ${this.user.lastName}`,
      }
    );
  }

  async googleRegister(companyName, password) {
    console.log(this.user);
    await this.send("register", "Welcome to Hr-Web Family!", {
      email: this.user.email,
      name: `${this.user.name} ${this.user.lastName}`,
      companyName,
      password,
    });
  }
}

export { Email };
