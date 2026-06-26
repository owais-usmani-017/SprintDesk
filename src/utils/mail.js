import mailgen from "mailgen";

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "welcome to our app!",
      action: {
        instructions:
          "to verify your email please click on the following button",
        button: {
          color: rgb(42, 188, 105),
          text: "verify your email",
          link: verificationUrl,
        },
      },
      outro: "need help or questions just reply on this email ",
    },
  };
};

import mailgen from "mailgen";

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "we got a request to resent the password",
      action: {
        instructions:
          "to reset the password please click on the following button",
        button: {
          color: rgb(42, 188, 105),
          text: "reset password",
          link: passwordResetUrl,
        },
      },
      outro: "need help or questions just reply on this email ",
    },
  };
};

export {emailVerificationMailgenContent,forgotPasswordMailgenContent}