import type { Request, Response } from "express";
import { sendEmail } from "../services/email.service.js";


export const testEmail = async (_req: Request, res: Response): Promise<void> => {

  try {
    const recipient = process.env.TEST_EMAIL_TO;

    if (!recipient) {
      res.status(500).json({
        success: false,
        message: "Test email recipient is not configured.",
      });
      return;
    }

    const data = await sendEmail(
      recipient,
      "Orbit-Grad Email Test",
      `
        <div style="font-family: Arial, sans-serif;">
          <h1>Welcome to Orbit-Grad!</h1>
          <p>Your Resend email integration is working.</p>
          <p>This is a test email from your Express backend.</p>
        </div>
        `
    );

    res.status(200).json({
      success: true,
      message: "Test email sent successfully.",
      data,
    })

  } catch (error) {
    console.error("Test email error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send test email.",
    });
  }
}