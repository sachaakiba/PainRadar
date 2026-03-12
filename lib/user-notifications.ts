import { Resend } from "resend";

interface NewUserParams {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
}

export async function sendNewUserNotification(user: NewUserParams): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.CONTACT_EMAIL;

  if (!resendApiKey || !notifyEmail) {
    console.log("New user notification not sent - email not configured");
    return;
  }

  const resend = new Resend(resendApiKey);

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#FF6B5B;">🎉 New User Registration</h2>
      <p>A new user just signed up on PainRadar!</p>
      
      <table style="border-collapse:collapse;width:100%;margin:20px 0;">
        <tr>
          <td style="padding:8px 12px;border:1px solid #eee;font-weight:600;background:#f9f9f9;">Name</td>
          <td style="padding:8px 12px;border:1px solid #eee;">${user.name ?? "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border:1px solid #eee;font-weight:600;background:#f9f9f9;">Email</td>
          <td style="padding:8px 12px;border:1px solid #eee;">${user.email}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border:1px solid #eee;font-weight:600;background:#f9f9f9;">User ID</td>
          <td style="padding:8px 12px;border:1px solid #eee;font-family:monospace;font-size:12px;">${user.id}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border:1px solid #eee;font-weight:600;background:#f9f9f9;">Registered at</td>
          <td style="padding:8px 12px;border:1px solid #eee;">${user.createdAt.toISOString()}</td>
        </tr>
      </table>
      
      <p style="color:#666;font-size:14px;">Environment: ${process.env.NODE_ENV ?? "unknown"}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "PainRadar <noreply@pain-radar.com>",
      to: notifyEmail,
      subject: `[PainRadar] New user: ${user.email}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send new user notification:", err);
  }
}
