//install and use the nodemailer
// configure the email server
// whom and what to sendemail , make the email body
// user the previous config to sent the email

import nodemailer from "nodemailer";

const emailProcessing = async (emailInfo) => {
  try {
    //config here
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    //send email here

    const info = await transporter.sendMail(emailInfo);

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};

// ==== email tempelating

//admin signup email verification
export const adminSignUpEmailVerification = ({ email, fName }, url) => {
  // send mail with defined transport object
  let info = {
    from: `"Register Form" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "New account confirmation - action required!", // Subject line
    text: `Hi ${fName}, please follow the link ${url} to verify your account.`, // plain text body
    html: `
    <p>Hi ${fName}</p>,
    <br />
    <br />
    Please follow the link below to verify you account:
    <br />
    <br />
<a href="${url}" style="color: red; font-weight: bolder;">Verify Now </a>
<br />
<br />

<p>
----------- <br />
Customer care team <br />
Coding Shop
</p>

`, // html body
  };

  emailProcessing(info);
};

//admin signup email verification
export const otpNotification = ({ fName, token, email }) => {
  // send mail with defined transport object
  let info = {
    from: `"Coding shop" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "OTP for password reset", // Subject line
    text: `Hi ${fName}, Here is your otp ${token} .`, // plain text body
    html: `
    <p>Hi ${fName}</p>
    <br />
    <br />
    Here is your otp:
    <br />
    <br />
 ${token} 
<br />
<br />

<p>
----------- <br />
Customer care team <br />
Coding Shop
</p>

`, // html body
  };

  emailProcessing(info);
};

//password resed confirmation notification
export const resetPasswordNotification = ({ fName, email }) => {
  // send mail with defined transport object
  let info = {
    from: `"Coding shop" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Password has been updated", // Subject line
    text: `Hi ${fName}, We have just got request to updat you password. If this wasn't you, conatct us or change your password asap.`, // plain text body
    html: `
    <p>Hi ${fName}</p>
    <br />
    <br />
    We have just got request to updat you password. If this wasn't you, conatct us or change your password asap.
    <br />
    <br />
   

<p>
----------- <br />
Customer care team <br />
Coding Shop
</p>

`, // html body
  };

  emailProcessing(info);
};
