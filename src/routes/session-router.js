import { Router } from "express";
import userController from "../controllers/userController.js";
import { passportCall } from "../services/authorization.js";

const router = Router();

router.post(
  "/register",
  passportCall("register", { strategyType: "locals" }),
  userController.userRegister
);

router.post(
  "/login",
  passportCall("login", { strategyType: "locals" }),
  userController.getUser
);

router.get(
  "/loginJWT",
  passportCall("jwt", { strategyType: "jwt" }),
  userController.getUserJWT
);

export default router;
