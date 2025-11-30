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

async function sendFollowUpEmail({ email, name, message, date }) {
  const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; background:#f8f9fc; padding:30px;">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:white;
      border-radius:10px;
      padding:25px 30px;
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
    ">
      
      <h2 style="margin-top:0; color:#1a2a4a;">Follow-Up Reminder</h2>

      <p style="color:#333; font-size:15px;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="color:#444; font-size:15px; line-height:1.6;">
        This is a reminder regarding your upcoming follow-up appointment.
      </p>

      <div style="
        background:#eef5ff;
        border-left:4px solid #4a90e2;
        padding:12px 16px;
        margin:20px 0;
        border-radius:6px;
      ">
        <p style="margin:0; font-size:15px; color:#1a2a4a;">
          <strong>Date:</strong> ${date}
        </p>
        <p style="margin:4px 0 0; font-size:15px; color:#1a2a4a;">
          <strong>Details:</strong> ${message}
        </p>
      </div>

      <p style="color:#444; font-size:15px; line-height:1.6;">
        If you need to reschedule or have any questions, feel free to contact us.
        We're here to support your health at every step.
      </p>

      <p style="margin-top:30px; color:#7d8590; font-size:13px;">
        Regards,<br/>
        <strong>ConsultMate Clinical Team</strong>
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:25px 0;" />

      <p style="color:#a1a8b3; font-size:12px; line-height:1.5;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
  `;

  const info = await transporter.sendMail({
    from: `ConsultMate <${process.env.Node_Mailer_Email}>`,
    to: email,
    subject: "Follow-Up Appointment Reminder",
    html: htmlTemplate,
  });

  console.log("Follow-Up Email Sent:", info.messageId);
}

export default sendFollowUpEmail;
