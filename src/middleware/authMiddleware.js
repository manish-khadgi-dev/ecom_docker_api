import { findAdmin } from "../models/adminUser/AdminUserModel.js";
import { getSession } from "../models/session/SessionModel.js";
import {
  verifyAccessJWT,
  verifyRefreshJWT,
  signAccessJWT,
} from "../utils/jwt.js";

export const adminAuth = async (req, res, next) => {
  try {
    // get the accessJWT

    const { authorization } = req.headers;

    // check if it is valid
    const { email } = verifyAccessJWT(authorization);

    if (email) {
      //check if it is in the db
      const { _id } = await getSession({ token: authorization });

      if (_id) {
        // get the user and set in the req obj
        const user = await findAdmin({ email });

        if (user?._id && user?.status === "active") {
          user.password = undefined;
          req.userInfo = user;
          return next();
        }
      }
    }

    res.status(403).json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (error) {
    if (error.message === "jwt expired") {
      error.errorCode = 403;
    }
    next(error);
  }
};

export const newAccessJWTAuth = async (req, res, next) => {
  try {
    // get the accessJWT

    const { authorization } = req.headers;

    // check if it is valid
    const { email } = verifyRefreshJWT(authorization);

    if (email) {
      //check if it is in the db
      const { _id } = await findAdmin({ email, refreshJWT: authorization });

      if (_id) {
        const accessJWT = await signAccessJWT({ email });

        if (accessJWT) {
          return res.json({
            status: "success",
            accessJWT,
          });
        }
      }
    }

    res.status(401).json({
      status: "error",
      message: "Unauthentication",
    });
  } catch (error) {
    next(error);
  }
};
