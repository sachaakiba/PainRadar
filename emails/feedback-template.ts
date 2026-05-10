type FeedbackTemplateParams = {
  userName: string;
  userEmail: string;
  feedback: string;
};

export function feedbackEmailTemplate(params: FeedbackTemplateParams): string {
  const { userName, userEmail, feedback } = params;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Nouveau feedback utilisateur</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9F6F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1A1F36;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F9F6F2;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E5E0D8; overflow: hidden; box-shadow: 0 2px 8px rgba(26, 31, 54, 0.06);">
          <tr>
            <td style="height: 4px; background-color: hsl(14, 100%, 64%);"></td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 16px 32px; border-bottom: 1px solid #E5E0D8;">
              <span style="font-size: 22px; font-weight: 700; color: #1A1F36;">PainRadar</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #1A1F36;">Nouveau feedback utilisateur</h1>
              <p style="margin: 0 0 8px 0; color: #6B7194; font-size: 14px;">Utilisateur</p>
              <p style="margin: 0 0 4px 0; font-weight: 600;">${escapeHtml(userName)}</p>
              <p style="margin: 0 0 20px 0; color: #6B7194;">${escapeHtml(userEmail)}</p>
              <p style="margin: 0 0 8px 0; color: #6B7194; font-size: 14px;">Feedback</p>
              <div style="padding: 20px; background-color: #F9F6F2; border-radius: 6px; border: 1px solid #E5E0D8;">
                <p style="margin: 0; white-space: pre-wrap; color: #1A1F36;">${escapeHtml(feedback)}</p>
              </div>
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
