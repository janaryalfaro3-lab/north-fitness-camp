import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Transporter setup
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
  }
};

// API routes
app.post("/api/notify-enrollment", async (req, res) => {
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

app.post("/api/notify-subscription", async (req, res) => {
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

app.post("/api/notify-signup", async (req, res) => {
  const { displayName, email, photoURL } = req.body;
  
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #FF0000; text-transform: uppercase;">New User Registered!</h2>
      <p>A new user has signed in via Google Auth:</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 10px; display: flex; align-items: center; gap: 15px;">
        ${photoURL ? `<img src="${photoURL}" style="width: 50px; h-weight: 50px; border-radius: 50%;" />` : ''}
        <div>
          <p><strong>Name:</strong> ${displayName || 'Anonymous'}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 20px;">Sent from North Fitness Camp AI Bot</p>
    </div>
  `;

  await sendNotification(`New Sign-in: ${displayName || email}`, html);
  res.json({ success: true });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
