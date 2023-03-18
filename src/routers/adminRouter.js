import express from "express";
import {
  createAdmin,
  findAdmin,
  findAdminAndUpdate,
} from "../models/adminUser/AdminUserModel.js";
import {
  createSession,
  deleteSession,
} from "../models/session/SessionModel.js";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
  adminSignUpEmailVerification,
  otpNotification,
  resetPasswordNotification,
} from "../utils/emails.js";
import { otpGenerator } from "../utils/randomGenerator.js";
import {
  adminRegistrationValidation,
  emailVerificationValidation,
  loginValidation,
  passwordResetValidation,
} from "../middleware/joiMiddleware.js";
import {
  signAccessJWT,
  signRefreshJWT,
  verifyRefreshJWT,
} from "../utils/jwt.js";
import { adminAuth, newAccessJWTAuth } from "../middleware/authMiddleware.js";

// admin resitration
router.post("/", adminRegistrationValidation, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);

    req.body.verificationCode = uuidv4();
    const result = await createAdmin(req.body);

    if (result?._id) {
      // we need to crate unique url and sent email to the client
      //process for the email
      const uniqueUrl = `http://localhost:3000/verify?c=${result.verificationCode}&email=${result.email}`;

      //call email service
      adminSignUpEmailVerification(result, uniqueUrl);

      res.json({
        status: "success",
        message:
          "We have sent an email verification link to your email. Please chek your meail (junk as well if not found in inbox) and follow the instructiosn to activate your account.",
      });

      return;
    }
    res.json({
      status: "error",
      message: "Error, Unable to create new admin, Try again latere",
    });
  } catch (error) {
    error.errorCode = 500;
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.errorCode = 200;
      error.message =
        "There is already an account exist associated with this email.";
    }
    next(error);
  }
});

// email verification
router.post(
  "/verify-email",
  emailVerificationValidation,
  async (req, res, next) => {
    try {
      const obj = {
        status: "active",
        verificationCode: "",
        isEmailVerified: true,
      };
      const result = await findAdminAndUpdate(req.body, obj);

      if (result?._id) {
        res.json({
          status: "success",
          message: "Your account has been verified, You may login now",
        });

        //send email confirmation as well

        return;
      }

      res.json({
        status: "error",
        message: "Invalid link",
      });
    } catch (error) {
      next(error);
    }
  }
);

// login user
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //does user exist for given email
    const admin = await findAdmin({ email });

    if (admin?.status === "inactive") {
      return res.json({
        status: "error",
        message:
          "Your account is inactive, check your email and activate your account.",
      });
    }

    if (admin?._id) {
      const isPasswordMatch = comparePassword(password, admin.password);

      if (isPasswordMatch) {
        const tokens = {
          accessJWT: await signAccessJWT({ email }),
          refreshJWT: await signRefreshJWT({ email }),
        };
        return res.json({
          status: "success",
          message: "Login successfull",
          tokens,
        });
      }
    }

    res.json({
      status: "error",
      message: "Invalid loging details",
    });
  } catch (error) {
    next(error);
  }
});

//otp requst
router.post("/request-otp", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email && typeof email === "string") {
      //does email exit for user
      const user = await findAdmin({ email });
      if (user?._id) {
        //create otp and store in new table, sessions
        const optLength = 6;
        const token = otpGenerator(optLength);

        const obj = {
          token,
          associate: email,
        };

        const result = await createSession(obj);

        if (result?._id) {
          //send that opt to the client's email
          otpNotification({ fName: user.fName, email, token });
        }
      }
    }

    res.json({
      status: "success",
      message:
        "If your email is found in our system, you will receive OTP. Please check junk folder as well.",
    });
  } catch (error) {
    next(error);
  }
});

//otp requst
router.patch(
  "/reset-password",
  passwordResetValidation,
  async (req, res, next) => {
    try {
      const { email, password, otp } = req.body;

      // check if email and opt exist in the db, if does then delete the record
      const filter = { token: otp, associate: email };
      const result = await deleteSession(filter);

      if (result?._id) {
        // hash the password

        const hashedPass = hashPassword(password);
        //update user table with password by email
        const user = await findAdminAndUpdate(
          { email },
          { password: hashedPass }
        );

        if (user?._id) {
          // send email notification
          resetPasswordNotification(user);

          return res.json({
            status: "success",
            message: "Your password has been updated, you may login now!",
          });
        }
      }

      res.json({
        status: "error",
        message:
          "Error! unable to reset the password, invalid otp or request. Contact administration.",
      });
    } catch (error) {
      next(error);
    }
  }
);

//TODO: private routes, use adminAuth middlewares
//get user profile
router.get("/", adminAuth, (req, res, next) => {
  try {
    res.json({
      status: "success",
      admin: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/new-accessjwt", newAccessJWTAuth);

router.patch("/logout", async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const { email } = verifyRefreshJWT(authorization);
    email && (await findAdminAndUpdate({ email }, { refreshJWT: "" }));
    res.json({
      status: "success",
      message: "logout processed",
    });
  } catch (error) {
    next(error);
  }
});
// update user profile
// update pasword form profli

export default router;
