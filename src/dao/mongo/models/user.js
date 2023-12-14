import mongoose from "mongoose";

const collection = "user";

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user",
  },
});

const userModel = mongoose.model(collection, schema);

export default userModel;
