/**
 * Generates the HTML email template for the PainRadar contact form.
 * Uses inline styles for maximum email client compatibility.
 */
export function contactEmailTemplate(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  const { name, email, subject, message } = params;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Nouveau message depuis PainRadar</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9F6F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1A1F36;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F9F6F2;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E5E0D8; overflow: hidden; box-shadow: 0 2px 8px rgba(26, 31, 54, 0.06);">
          <!-- Colored accent bar at top -->
          <tr>
            <td style="height: 4px; background-color: hsl(14, 100%, 64%);"></td>
          </tr>
          <!-- Header with logo -->
          <tr>
            <td style="padding: 24px 32px 16px 32px; border-bottom: 1px solid #E5E0D8;">
              <span style="font-size: 22px; font-weight: 700; color: #1A1F36; letter-spacing: -0.02em;">PainRadar</span>
            </td>
          </tr>
          <!-- Main content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #1A1F36;">Nouveau message depuis PainRadar</h1>
              
              <!-- Sender info card -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px; background-color: #F9F6F2; border-radius: 6px; border-left: 4px solid hsl(14, 100%, 64%);">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7194;">De :</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1A1F36;">${escapeHtml(name)} <span style="font-weight: 400; color: #6B7194;">(${escapeHtml(email)})</span></p>
                    <p style="margin: 16px 0 8px 0; font-size: 14px; color: #6B7194;">Objet :</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1A1F36;">${escapeHtml(subject)}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Message body -->
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7194;">Message :</p>
              <div style="padding: 20px; background-color: #F9F6F2; border-radius: 6px; border: 1px solid #E5E0D8;">
                <p style="margin: 0; font-size: 15px; color: #1A1F36; white-space: pre-wrap;">${escapeHtml(message)}</p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px 24px 32px; border-top: 1px solid #E5E0D8; background-color: #F9F6F2;">
              <p style="margin: 0; font-size: 13px; color: #6B7194;">Ce message a été envoyé via le formulaire de contact PainRadar.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] ?? char);
}
