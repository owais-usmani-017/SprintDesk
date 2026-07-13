import {body} from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email").trim().isEmail().withMessage("Email is not valid").isEmail().withMessage("Email is not valid"),

        body("username").trim().notEmpty().withMessage("username is required").isLowercase().withMessage("username must be in lowercase").isLength({min:3}).withMessage("username must be 3 characters long"),

        body("password").trim().notEmpty().withMessage("password is required"),

        body("fullname").optional().trim()
        
    ]
}

const userLoginValidator = ()=>{
    return[
        body("email").optional().isEmail().withMessage("email is invalid"),

        body("password").notEmpty().withMessage("password is required")
    ]
}

const userChangeCurrentPasswordValidator = () =>{
    return [
        body("oldPassword").notEmpty().withMessage("old password is required"),

        body("newPassword").notEmpty().withMessage("new password is required")
    ]
}

const userForgotPasswordValidator = () =>{
    return [
        body("email").notEmpty().withMessage("email is required").isEmail().withMessage("email is invalid"),

        
    ]
}

const userResetForgotPasswordValidator = () =>{
    return [
        body("newPassword").notEmpty().withMessage("password is required"),

        
    ]
}

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userResetForgotPasswordValidator,
  userForgotPasswordValidator,
};