const nodemailer = require("nodemailer");
require('dotenv').config();
// async..await is not allowed in global scope, must use a wrapper

module.exports = async function main(email, token, hostname) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: testAccount.user, // generated ethereal user
  //     pass: testAccount.pass, // generated ethereal password
  //   },
  // });

  let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
      user : process.env.TRANSPORTER_ACCOUNT,
      pass : process.env.TRANSPORTER_PASSWORD
    }
  })

  let alink = hostname == 'localhost' ? `http://localhost:3000/profile/password/reset/${token}` : `https://moleapp.herokuapp.com/profile/password/reset/${token}`
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.TRANSPORTER_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Password reset", // Subject line
    text: "Click the link below to reset your password", // plain text body
    html: `<a href="${alink}">Click me to reset the password</a>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);