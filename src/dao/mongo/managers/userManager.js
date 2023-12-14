import mongoose from "mongoose";
import userModel from "../models/user.js";

class UserManager {
  getUser = () => {
    return userModel.find().lean();
  };

  getUserBy = (params) => {
    return userModel.findOne(params).lean();
  };

  saveUser = (User) => {
    return userModel.create(User);
  };

  updateUser = (id, User) => {
    return userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
      $set: User,
    });
  };

  deleteUser = (id) => {
    return userModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  };
}

export default new UserManager();
