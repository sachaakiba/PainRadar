import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "PainRadar <noreply@pain-radar.com>";

interface SendVerificationEmailParams {
  to: string;
  name: string | null;
  url: string;
  locale?: string;
}

interface SendPasswordResetEmailParams {
  to: string;
  name: string | null;
  url: string;
  locale?: string;
}

const translations = {
  en: {
    verification: {
      subject: "Verify your email address - PainRadar",
      greeting: (name: string | null) => name ? `Hi ${name},` : "Hi there,",
      intro: "Thanks for signing up for PainRadar! Please verify your email address by clicking the button below.",
      button: "Verify Email",
      linkText: "Or copy and paste this link into your browser:",
      expiry: "This link expires in 1 hour.",
      ignore: "If you didn't create an account on PainRadar, you can safely ignore this email.",
      footer: "© 2026 PainRadar. All rights reserved.",
    },
    passwordReset: {
      subject: "Reset your password - PainRadar",
      greeting: (name: string | null) => name ? `Hi ${name},` : "Hi there,",
      intro: "We received a request to reset your password. Click the button below to choose a new password.",
      button: "Reset Password",
      linkText: "Or copy and paste this link into your browser:",
      expiry: "This link expires in 1 hour.",
      ignore: "If you didn't request a password reset, you can safely ignore this email.",
      footer: "© 2026 PainRadar. All rights reserved.",
    },
  },
  fr: {
    verification: {
      subject: "Vérifiez votre adresse email - PainRadar",
      greeting: (name: string | null) => name ? `Bonjour ${name},` : "Bonjour,",
      intro: "Merci de vous être inscrit sur PainRadar ! Veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous.",
      button: "Vérifier l'email",
      linkText: "Ou copiez et collez ce lien dans votre navigateur :",
      expiry: "Ce lien expire dans 1 heure.",
      ignore: "Si vous n'avez pas créé de compte sur PainRadar, vous pouvez ignorer cet email.",
      footer: "© 2026 PainRadar. Tous droits réservés.",
    },
    passwordReset: {
      subject: "Réinitialisez votre mot de passe - PainRadar",
      greeting: (name: string | null) => name ? `Bonjour ${name},` : "Bonjour,",
      intro: "Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.",
      button: "Réinitialiser le mot de passe",
      linkText: "Ou copiez et collez ce lien dans votre navigateur :",
      expiry: "Ce lien expire dans 1 heure.",
      ignore: "Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet email.",
      footer: "© 2026 PainRadar. Tous droits réservés.",
    },
  },
};

function getEmailTemplate(
  type: "verification" | "passwordReset",
  { name, url, locale = "en" }: { name: string | null; url: string; locale?: string }
) {
  const t = translations[locale as keyof typeof translations]?.[type] ?? translations.en[type];

  const buttonColor = "#FF6B5B";

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: ${buttonColor};">
                PainRadar
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #18181b;">
                ${t.greeting(name)}
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #3f3f46;">
                ${t.intro}
              </p>
              
              <!-- Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding: 8px 0 24px;">
                    <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: ${buttonColor}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      ${t.button}
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Link fallback -->
              <p style="margin: 0 0 8px; font-size: 14px; color: #71717a;">
                ${t.linkText}
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; word-break: break-all;">
                <a href="${url}" style="color: ${buttonColor}; text-decoration: underline;">${url}</a>
              </p>
              
              <p style="margin: 0 0 8px; font-size: 14px; color: #71717a;">
                ${t.expiry}
              </p>
              <p style="margin: 0; font-size: 14px; color: #71717a;">
                ${t.ignore}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 40px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa; text-align: center;">
                ${t.footer}
              </p>
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

export async function sendVerificationEmail({
  to,
  name,
  url,
  locale = "en",
}: SendVerificationEmailParams): Promise<void> {
  const t = translations[locale as keyof typeof translations]?.verification ?? translations.en.verification;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: t.subject,
      html: getEmailTemplate("verification", { name, url, locale }),
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
}

export async function sendPasswordResetEmail({
  to,
  name,
  url,
  locale = "en",
}: SendPasswordResetEmailParams): Promise<void> {
  const t = translations[locale as keyof typeof translations]?.passwordReset ?? translations.en.passwordReset;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: t.subject,
      html: getEmailTemplate("passwordReset", { name, url, locale }),
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
}
