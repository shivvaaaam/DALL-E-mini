import nodemailer from 'nodemailer';

const mailSender = async (email, title, body) => {
  try {
    // Configure the transporter
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send the email
    let info = await transporter.sendMail({
      from: "OpenAi- By Shivam",
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent: ", info);
    return info;

  } catch (error) {
    console.error("Error sending email: ", error.message);
    throw error; // Optional: Propagate the error to the caller
  }
};

export default mailSender;
