import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

//------------------------------- BCRYPT -------------------------------//
export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
};

export const validatePassword = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

//------------------------------- JWT -------------------------------//
export const generateToken = (user, expiresIn = "6h") => {
  const token = jwt.sign(user, config.jwtSecret, { expiresIn });
  return token;
};

//------------------------------- PASSPORT -------------------------------//
export const passportCall = (strategy, options = {}) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { failureMessage: true },
      (error, user, info) => {
        if (error) return next(error);
        if (!options.strategyType) {
          console.log(`Route ${req.url} doesn't have definied strategyType`);
          return res
            .status(500)
            .send({ status: "error", error: "internal server error" });
        }
        if (!user) {
          switch (options.strategyType) {
            case "jwt":
              req.error = info.message ? info.message : info.toString();
              return next();

            case "locals":
              return res.status(400).send({
                message: info.message ? info.message : "error",
              });
          }
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};
