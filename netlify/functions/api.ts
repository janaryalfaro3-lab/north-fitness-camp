import express, { Router } from "express";
import serverless from "serverless-http";
import nodemailer from "nodemailer";

const api = express();
const router = Router();

api.use(express.json());

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendNotification = async (subject: string, html: string) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials missing. Skipping email notification.");
    return;
  }

  const transporter = createTransporter();
  const mailOptions = {
    from: `"North Fitness Bot" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFICATION_EMAIL || "thefitnesscamp23@gmail.com",
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Notification email sent successfully!");
  } catch (error) {
    console.error("Error sending notification email:", error);
  } finally {
    transporter.close(); // Crucial for serverless environments to prevent the function from hanging
  }
};

router.post("/notify-enrollment", async (req, res) => {
  const { fullName, mobileNumber, email, program, schedule, coach, goals } = req.body;
  
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #FF0000; text-transform: uppercase;">New Enrollment Application!</h2>
      <p>A new guest has just applied via the website:</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 10px;">
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Mobile:</strong> ${mobileNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Program:</strong> ${program}</p>
        <p><strong>Schedule:</strong> ${schedule}</p>
        <p><strong>Preferred Coach:</strong> ${coach || 'None selected'}</p>
        <p><strong>Goals:</strong> ${goals || 'No goals specified'}</p>
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 20px;">Sent from North Fitness Camp AI Bot</p>
    </div>
  `;

  await sendNotification(`New Enrollment: ${fullName}`, html);
  res.json({ success: true });
});

router.post("/notify-subscription", async (req, res) => {
  const { email } = req.body;
  
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #FF0000; text-transform: uppercase;">New Subscriber!</h2>
      <p>A new guest has joined the Inner Circle newsletter:</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 10px;">
        <p><strong>Email:</strong> ${email}</p>
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 20px;">Sent from North Fitness Camp AI Bot</p>
    </div>
  `;

  await sendNotification(`New Subscriber: ${email}`, html);
  res.json({ success: true });
});

// Use the router underneath /api
api.use("/api/", router);

export const handler = serverless(api);
