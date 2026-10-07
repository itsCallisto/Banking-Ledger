require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger";
  const text = `Welcome to Our App!

Hi ${name},

Your account has been successfully created.

We're excited to have you with us! You can now log in and start using your account.

Thanks for joining us!

Best regards,
The Team
`;
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">

    <div style="
        max-width: 500px;
        margin: auto;
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
    ">

        <h1 style="color: #2563eb;">
            Welcome to Our App! 👋
        </h1>

        <p style="font-size: 16px; color: #333;">
            Hi ${name},
        </p>

        <p style="font-size: 16px; color: #555;">
            Your account has been successfully created.
            We're excited to have you with us!
        </p>

        <p style="font-size: 14px; color: #777;">
            You can now log in and start using your account.
        </p>

        <p style="margin-top: 30px; color: #333;">
            Thanks for joining us!
        </p>

    </div>

</body>
</html>
`;
  await sendEmail(userEmail, subject, text, html)
}


async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful - Backend Ledger";

  const text = `Transaction Successful!

Hi ${name},

Your transaction has been successfully completed.

Transaction Details:
Amount: ₹${amount}
Transferred To: ${toAccount}
Date: ${new Date().toLocaleString()}

The amount has been successfully transferred to the recipient's account.

If you did not authorize this transaction, please contact support immediately.

Best regards,
Backend Ledger Team
`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">

    <div style="
        max-width: 500px;
        margin: auto;
        background: white;
        padding: 30px;
        border-radius: 10px;
    ">

        <h1 style="
            color: #16a34a;
            text-align: center;
        ">
            Transaction Successful ✓
        </h1>

        <p style="font-size: 16px; color: #333;">
            Hi ${name},
        </p>

        <p style="font-size: 16px; color: #555;">
            Your transaction has been successfully completed.
        </p>

        <div style="
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        ">

            <p style="margin: 8px 0; color: #555;">
                <strong>Amount</strong>
            </p>

            <p style="
                font-size: 28px;
                font-weight: bold;
                color: #16a34a;
                margin: 5px 0 20px;
            ">
                ₹${amount}
            </p>

            <p style="margin: 8px 0; color: #555;">
                <strong>Transferred To:</strong> ${toAccount}
            </p>

            <p style="margin: 8px 0; color: #555;">
                <strong>Date:</strong> ${new Date().toLocaleString()}
            </p>

        </div>

        <p style="
            font-size: 14px;
            color: #777;
            margin-top: 25px;
        ">
            The amount has been successfully transferred to the recipient's account.
        </p>

        <p style="
            font-size: 14px;
            color: #dc2626;
            margin-top: 20px;
        ">
            If you did not authorize this transaction, please contact support immediately.
        </p>

        <p style="
            margin-top: 30px;
            color: #333;
        ">
            Best regards,<br>
            <strong>Backend Ledger Team</strong>
        </p>

    </div>

</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
}



module.exports = {sendRegistrationEmail,sendTransactionEmail}