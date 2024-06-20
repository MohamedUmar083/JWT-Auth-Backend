import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
});

const Jwt_User = mongoose.model("Jwt_User", userSchema);

export default Jwt_User;
