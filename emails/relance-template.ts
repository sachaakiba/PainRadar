type RelanceEmailTemplateParams = {
  name?: string | null;
  feedbackUrl: string;
  locale?: string | null;
};

export function relanceEmailTemplate(params: RelanceEmailTemplateParams): string {
  const { name, feedbackUrl, locale } = params;
  const isFrench = locale === "fr";
  const firstName = name?.trim()?.split(" ")[0] || "";

  const title = isFrench
    ? "Votre avis peut faire évoluer PainRadar"
    : "Your feedback can shape PainRadar";
  const intro = isFrench
    ? firstName
      ? `Bonjour ${escapeHtml(firstName)},`
      : "Bonjour,"
    : firstName
      ? `Hi ${escapeHtml(firstName)},`
      : "Hi,";
  const body = isFrench
    ? "Nous travaillons chaque semaine pour rendre PainRadar plus utile, plus clair, et plus impactant pour les fondateurs. Votre retour d'expérience est ce qui nous aide le plus à prioriser les bonnes améliorations."
    : "We improve PainRadar every week to make it more useful, clearer, and more impactful for builders. Your experience is what helps us prioritize the right improvements.";
  const ask = isFrench
    ? "En 2 minutes, dites-nous ce qui vous a plu, ce qui vous manque, et ce qui vous ferait revenir plus souvent."
    : "In just 2 minutes, tell us what you loved, what is missing, and what would make you come back more often.";
  const cta = isFrench ? "Donner mon feedback" : "Share my feedback";
  const outro = isFrench
    ? "Merci d'avance pour votre aide, elle a un vrai impact produit."
    : "Thanks in advance. Your input has a direct impact on product decisions.";

  return `
<!DOCTYPE html>
<html lang="${isFrench ? "fr" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9F6F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1A1F36;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F9F6F2;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 620px; width: 100%; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E5E0D8; overflow: hidden; box-shadow: 0 2px 8px rgba(26, 31, 54, 0.06);">
          <tr>
            <td style="height: 4px; background-color: hsl(14, 100%, 64%);"></td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 16px 32px; border-bottom: 1px solid #E5E0D8;">
              <span style="font-size: 22px; font-weight: 700; color: #1A1F36; letter-spacing: -0.02em;">PainRadar</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 650; color: #1A1F36;">${title}</h1>
              <p style="margin: 0 0 14px 0;">${intro}</p>
              <p style="margin: 0 0 12px 0; color: #333B57;">${body}</p>
              <p style="margin: 0 0 26px 0; color: #333B57;">${ask}</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="border-radius: 10px; background-color: hsl(14, 100%, 64%);">
                    <a href="${escapeHtml(feedbackUrl)}" style="display: inline-block; padding: 12px 20px; color: #FFFFFF; text-decoration: none; font-weight: 600; font-size: 15px;">
                      ${cta}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #6B7194;">${outro}</p>
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
