import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";
import { createError } from "../error.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  port: 465,
  host: "smtp.gmail.com",
});

const User = db.user;

export const SignUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    //check if user already exists
    const userExists = await User.findOne({
      where: { email },
    });
    if (userExists) return next(createError(409, "User already exists"));

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(201).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const SignIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) return next(createError(404, "User does not exist"));
    if (user.googleAuth)
      return next(createError(401, "Please login with google"));
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return next(createError(401, "Invalid password"));

    const token = jwt.sign({ id: user.id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const googleAuthSignIn = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      try {
        const user = new User({ ...req.body, googleAuth: true });
        await user.save();
        const token = jwt.sign({ id: user.id }, process.env.JWT, {
          expiresIn: "9999 years",
        });
        res.status(200).json({ token, user: user });
      } catch (err) {
        next(createError(err.status, err.message));
      }
    } else if (user.googleAuth) {
      const token = jwt.sign({ id: user.id }, process.env.JWT, {
        expiresIn: "9999 years",
      });
      res.status(200).json({ token, user });
    } else if (user.googleAuth === false) {
      return next(
        createError(
          402,
          "User already exists with this email can't do google auth"
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

export const generateOTP = async (req, res, next) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
  const { email } = req.query;
  const { name } = req.query;
  const { reason } = req.query;
  const verifyOtp = {
    to: email,
    subject: "Account Verification OTP",
    html: `
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #007AFF; text-align: center; margin-bottom: 30px;">Verify Your DecisionHub Account</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #007AFF; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a DecisionHub account. To activate your account, please enter the following verification code:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #007AFF;">${req.app.locals.OTP}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the DecisionHub app to activate your account.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a DecisionHub account, please disregard this email.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The DecisionHub Team</p>
</div>
`,
  };

  const resetPasswordOtp = {
    to: email,
    subject: "DecisionHub Reset Password Verification",
    html: `
            <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h1 style="font-size: 22px; font-weight: 500; color: #007AFF; text-align: center; margin-bottom: 30px;">Reset Your DecisionHub Account Password</h1>
                <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #007AFF; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                        <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                        <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">To reset your DecisionHub account password, please enter the following verification code:</p>
                        <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #007AFF;">${req.app.locals.OTP}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the DecisionHub app to reset your password.</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not request a password reset, please disregard this email.</p>
                    </div>
                </div>
                <br>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The DecisionHub Team</p>
            </div>
        `,
  };
  if (reason === "FORGOTPASSWORD") {
    transporter.sendMail(resetPasswordOtp, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send({ message: "OTP sent" });
    });
  } else {
    console.log(email)
    transporter.sendMail(verifyOtp, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send({ message: "OTP sent" });
    });
  }
};

export const verifyOTP = async (req, res, next) => {
  const { code } = req.query;
  // eslint-disable-next-line radix
  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(200).send({ message: "OTP verified" });
  }
  return next(createError(403, "Wrong OTP"));
};

export const createResetSession = async (req, res, next) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(200).send({ message: "Access granted" });
  }

  return res.status(400).send({ message: "Session expired" });
};

export const resetPassword = async (req, res, next) => {
  if (!req.app.locals.resetSession)
    return res.status(440).send({ message: "Session expired" });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Update the user's password using Sequelize
      await User.update(
        { password: hashedPassword },
        {
          where: {
            email: email,
          },
        }
      );

      req.app.locals.resetSession = false;
      return res.status(200).send({
        message: "Password reset successful",
      });
    } else {
      next(createError("User not found", 404));
    }
  } catch (err) {
    next(createError(err.message, err.status));
  }
};
