import Joi from "joi";

const EMAIL = Joi.string().email({ minDomainSegments: 2 }).required();
const SHORT_STR = Joi.string().max(100);
const LONG_STR = Joi.string().max(500);

export const validationProcessor = (req, res, next, schema) => {
  try {
    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

// ====== admin user validation
export const adminRegistrationValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: SHORT_STR.required(),
    lName: SHORT_STR.required(),
    phone: SHORT_STR.allow("", null),
    address: SHORT_STR.allow("", null),
    email: EMAIL,
    password: SHORT_STR.min(6).required(),
  });

  return validationProcessor(req, res, next, schema);
};

export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    verificationCode: Joi.string().required(),
    email: EMAIL,
  });

  return validationProcessor(req, res, next, schema);
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    email: EMAIL,
  });

  return validationProcessor(req, res, next, schema);
};

export const passwordResetValidation = (req, res, next) => {
  const schema = Joi.object({
    otp: Joi.string().required(),
    password: Joi.string().required(),
    email: EMAIL,
  });

  return validationProcessor(req, res, next, schema);
};

// ====== category user validation
export const newCategoryValidation = (req, res, next) => {
  const schema = Joi.object({
    name: SHORT_STR.required(),
  });

  return validationProcessor(req, res, next, schema);
};
export const updateCategoryValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORT_STR.required(),
    name: SHORT_STR.required(),
    status: SHORT_STR.required(),
  });

  return validationProcessor(req, res, next, schema);
};
