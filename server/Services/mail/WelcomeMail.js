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

async function welcomeMail({ email, patientId, number, name, subject }) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; padding:16px;">
      <h2 style="color:#333;">Welcome to ConsultMate</h2>

      <p>Dear <strong>${name}</strong>,</p>

      <p>Your patient account has been successfully created.</p>

      <p><strong>Patient ID:</strong> ${patientId}<br/>
         <strong>Registered Email:</strong> ${email}<br/>
         <strong>Mobile Number:</strong> ${number}</p>

      <p>Thank you for choosing ConsultMate. We're here to support your care journey.</p>

      <p style="color:#d00; font-size:14px;">
        If this account was not created by you, please contact us immediately.
      </p>

      <hr />
      <p style="font-size:12px; color:#888;">ConsultMate – Smart Clinical Workflow Assistant</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `ConsultMate <${process.env.Node_Mailer_Email}>`,
    to: email,
    subject: subject || "Your ConsultMate Account Details",
    html,
  });

  console.log("Message sent:", info.messageId);
}

export default welcomeMail;
