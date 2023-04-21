const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});
const sendEmail = (listEmail) => {
  const mailOptions = {
    from: "hoanghip108@gmail.com",
    to: listEmail,
    subject: "New form was submitted",
    text: "New form was created please check your form",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
export default sendEmail;
