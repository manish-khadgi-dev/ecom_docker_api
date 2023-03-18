import SessionSchema from "./SessionSchema.js";

//create new token
export const createSession = (obj) => {
  return SessionSchema(obj).save();
};

//delete token
export const deleteSession = (filter) => {
  return SessionSchema.findOneAndDelete(filter);
};
//delete token
export const getSession = (filter) => {
  return SessionSchema.findOne(filter);
};
