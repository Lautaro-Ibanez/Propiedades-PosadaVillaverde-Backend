import { generateToken } from "../services/authorization.js";

const userRegister = async (req, res) => {
  res.send({ status: "success", message: "successful registration" });
};

const getUser = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res
      .cookie("authToken", token, {
        maxAge: 1000 * 3600 * 6,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .send({ status: "success", message: "Logged In" });
  } catch (error) {
    console.log(error);
    res.send({ status: "error", error: error });
  }
};

const getUserJWT = async (req, res) => {
  return res.send({ status: "success", payload: req.user });
};

export default {
  userRegister,
  getUser,
  getUserJWT,
};
