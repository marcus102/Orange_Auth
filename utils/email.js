const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // create a transpoerter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    //activate 'less secure app' option in gmail
  });
  // define the email options
  const mailOptions = {
    from: 'Orange <orange@test.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  // send the email with node mailer

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
