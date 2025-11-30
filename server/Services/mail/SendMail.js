import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.Node_Mailer_Email,  
    pass: process.env.Node_Mailer_Pass,  
  },
});

async function sendMail({ email, finalText, subject }) {

  const htmlTemplate = `
    <div style="font-family: Arial; line-height:1.6;">
      <h2>Your Final Clinical Note</h2>
      <p>${finalText}</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `Consultmate <${process.env.Node_Mailer_Email}>`,
    to: email,
    subject: subject || "Your Clinical Note",
    html: htmlTemplate,
  });

  console.log("Message sent:", info.messageId);
}

export default sendMail;

