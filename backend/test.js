import { Resend } from "resend";

// Проверяем наличие API ключа
const apiKey = "re_PkUbrmJk_517zQEVjfPdhB4z1umFr5SR4";
console.log(
  "API Key starts with:",
  apiKey ? apiKey.substring(0, 4) + "..." : "not found"
);

const resend = new Resend(apiKey);

async function testResend() {
  try {
    console.log("Attempting to send test email...");

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Используем тестовый домен Resend
      to: "tasich2015@gmail.com",
      subject: "Test Email from StudyFlow",
      html: "<p>This is a test email to verify Resend configuration.</p>",
    });

    if (error) {
      console.error("Resend API Error:", error);
      return;
    }

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testResend();
