import AdminUserSchema from "./AdminUserSchema.js";

//create new user
export const createAdmin = (obj) => {
  return AdminUserSchema(obj).save();
};

// find user by filter. @filter must be an object
export const findAdmin = (filter) => {
  return AdminUserSchema.findOne(filter);
};
// find user by filter and update. @filter & @obj must be an object and
export const findAdminAndUpdate = (filter, obj) => {
  return AdminUserSchema.findOneAndUpdate(filter, obj, {
    new: true,
  });
};
