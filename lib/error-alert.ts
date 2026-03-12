import { Resend } from "resend";

interface ErrorAlertParams {
  source: string;
  error: unknown;
  context?: Record<string, unknown>;
}

export async function sendErrorAlert({
  source,
  error,
  context,
}: ErrorAlertParams): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.CONTACT_EMAIL;

  if (!resendApiKey || !alertEmail) {
    console.error("Error alert not sent - email not configured:", { source, error });
    return;
  }

  const resend = new Resend(resendApiKey);

  const errorMessage =
    error instanceof Error ? error.message : String(error);
  const errorStack =
    error instanceof Error ? error.stack : undefined;

  const contextHtml = context
    ? `<h3>Context</h3><pre style="background:#f4f4f4;padding:12px;border-radius:4px;overflow-x:auto;">${JSON.stringify(context, null, 2)}</pre>`
    : "";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#e00;">PainRadar Error Alert</h2>
      <p><strong>Source:</strong> ${source}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Environment:</strong> ${process.env.NODE_ENV ?? "unknown"}</p>
      
      <h3>Error Message</h3>
      <pre style="background:#fee;padding:12px;border-radius:4px;color:#c00;overflow-x:auto;">${errorMessage}</pre>
      
      ${errorStack ? `<h3>Stack Trace</h3><pre style="background:#f4f4f4;padding:12px;border-radius:4px;font-size:12px;overflow-x:auto;">${errorStack}</pre>` : ""}
      
      ${contextHtml}
    </div>
  `;

  try {
    await resend.emails.send({
      from: "PainRadar Alerts <onboarding@resend.dev>",
      to: alertEmail,
      subject: `[PainRadar Error] ${source}`,
      html,
    });
  } catch (emailError) {
    console.error("Failed to send error alert email:", emailError);
  }
}
