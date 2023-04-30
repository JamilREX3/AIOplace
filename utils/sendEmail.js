const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // create transporter (service that send email like gmail , mailtrap)
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587 , if true = 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // Define email options (like from .. to .. , subject , email content)
  mailOpts = {
    from: "Jamil AIO Place <hamadt604@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
