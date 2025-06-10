const { Resend } = require("resend");

// Load environment variables

// Get API key and validate it
const apiKey = "re_PkUbrmJk_517zQEVjfPdhB4z1umFr5SR4";
if (!apiKey) {
  console.error("RESEND_API_KEY is not set in environment variables");
  throw new Error(
    "Email service is not properly configured. RESEND_API_KEY is missing."
  );
}

console.log("API Key starts with:", apiKey.substring(0, 4) + "...");

const resend = new Resend(apiKey);

const sendClassInvitation = async (email, className, classCode) => {
  if (!email || !className || !classCode) {
    throw new Error("Missing required parameters for sending invitation");
  }

  try {
    console.log("Attempting to send email to:", email);
    console.log("Class details:", { className, classCode });

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Using Resend's test domain
      to: email,
      subject: `Invitation to join ${className} class`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #415688;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 0 0 8px 8px;
            }
            .code {
              background-color: #e9ecef;
              padding: 10px 20px;
              border-radius: 4px;
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              letter-spacing: 2px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to StudyFlow!</h1>
            </div>
            <div class="content">
              <h2>You've been invited to join ${className}</h2>
              <p>Hello! You have been invited to join the class "${className}" on StudyFlow. To join the class, you'll need to use the following class code:</p>
              
              <div class="code">${classCode}</div>
              
              <p>To join the class:</p>
              <ol>
                <li>Log in to your StudyFlow account</li>
                <li>Click on "Join Class" button</li>
                <li>Enter the class code shown above</li>
              </ol>

              <p>If you don't have a StudyFlow account yet, you'll need to create one first:</p>
              <a href="http://localhost:3000/register" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">Create Account</a>
              <p style="margin-top: 20px;">Once you've joined, you'll have access to all class materials, assignments, and discussions.</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>If you received this invitation by mistake, you can safely ignore it.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in sendClassInvitation:", error);
    throw error;
  }
};

module.exports = {
  sendClassInvitation,
};
