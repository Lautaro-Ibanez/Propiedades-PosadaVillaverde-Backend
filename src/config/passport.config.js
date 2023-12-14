import passport from "passport";
import local from "passport-local";
import { Strategy, ExtractJwt } from "passport-jwt";

import { cookieExtractor } from "../util.js";
import { createHash, validatePassword } from "../services/authorization.js";

import config from "./config.js";

import userManager from "../dao/mongo/managers/userManager.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = Strategy;

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { name, email, role } = req.body;
          const exists = await userManager.getUserBy({ email });
          if (exists) {
            return done(null, false, { message: "User Already Exist" });
          }
          console.log(password);
          const hashedPassword = await createHash(password);
          console.log(hashedPassword);

          const newUser = {
            name,
            email,
            password: hashedPassword,
            role: role ? role : "user",
          };
          console.log(newUser);
          const result = await userManager.saveUser(newUser);
          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        let user;

        user = await userManager.getUserBy({ email });
        if (!user) {
          return done(null, false, { message: "user not found" });
        }

        const isValidPassword = await validatePassword(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: "invalid password" });
        }

        user = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        return done(null, user);
      }
    )
  );

  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    if (id === 0) {
      done(null, {
        role: "admin",
        name: "admin",
      });
    }
    const user = userManager.getUserBy({ _id: id });
    return done(null, user);
  });
};

//--------------------------------------- PASSPORT JWT ----------------------------------------//

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: config.jwtSecret,
    },
    async (payload, done) => {
      return done(null, payload);
    }
  )
);

export default initializePassportStrategies;
