import Jwt, { verify } from "jsonwebtoken";
import { token } from "morgan";
import { findAdminAndUpdate } from "../models/adminUser/AdminUserModel.js";
import { createSession } from "../models/session/SessionModel.js";

//@payload must be an object
export const signAccessJWT = async (payload) => {
  const token = Jwt.sign(payload, process.env.ACCESS_JWT, {
    expiresIn: "1m",
  });

  //stores in session table
  await createSession({ token });

  return token;
};

export const verifyAccessJWT = (token) => {
  return Jwt.verify(token, process.env.ACCESS_JWT);
};

//@payload must be an object
export const signRefreshJWT = async (payload) => {
  const token = Jwt.sign(payload, process.env.REFRESH_JWT, {
    expiresIn: "30d",
  });

  // stores with the user informaton in user table
  await findAdminAndUpdate(payload, { refreshJWT: token });
  return token;
};

export const verifyRefreshJWT = (token) => {
  try {
    return Jwt.verify(token, process.env.REFRESH_JWT);
  } catch (error) {
    return error.message;
  }
};
