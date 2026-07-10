import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// Create transporter once
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "w2qclzgusu5ks4vh@ethereal.email",
    pass: "K322scVkp4eFs3EkGa",
  },
});

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanagerlink.com",
    },
  });

  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const mail = {
    from: process.env.MAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    console.log(`📨 Sending email to ${options.email}...`);

    const info = await transporter.sendMail(mail);

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);

    /*if (previewUrl) {
      console.log("📧 Preview URL:");
      console.log(previewUrl);

    }
      return info;
      */
  } catch (error) {
    console.error("❌ Failed to send email");
    console.error(error);
    throw error;
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app!",
      action: {
        instructions: "To verify your email, please click the button below.",
        button: {
          color: "#2abc69",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro: "Need help? Just reply to this email.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We received a request to reset your password.",
      action: {
        instructions: "To reset your password, please click the button below.",
        button: {
          color: "#2abc69",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro:
        "If you didn't request this password reset, you can safely ignore this email.",
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
