import Jwt_User from "../Model/userSchema.js";
import bcrypt from "bcryptjs";
import sendPasswordResetEmail from "../Service/nodemailer.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // const find = Jwt_User.find(email);
    // console.log(find);
    // if (find) {
    //   return res.status(409).json({ Message: "User Already Registered" });
    // }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await Jwt_User({ username, email, password: hash });
    await newUser.save();
    res
      .status(200)
      .json({ Message: "User Registered Successfully", Data: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ Message: "Registeration Failed Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Jwt_User.findOne({ email });
    if (!user) {
      return res.status(401).json({ Message: "User Not Found" });
    }

    const pasMatch = await bcrypt.compare(password, user.password);
    if (!pasMatch) {
      return res.status(401).json({ Message: "Invalid Password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    res.status(200).json({ Message: "Logged in Successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Message: "Login Failed Internal Server Error" });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Jwt_User.findOne({ email });
    if (!user) {
      return res.status(401).json({ Message: "User Not Found" });
    }
    const { success, error } = await sendPasswordResetEmail(
      user.email,
      user._id
    );

    if (success) {
      res.status(200).json({ Message: "Password reset email sent" });
    } else {
      res.status(500).json({ Message: "Error sending email", error });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ Message: "Internal Server Error Action in Forget Password" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const userid = req.params.id;
    const { newpassword, confirmpassword } = req.body;
    if (newpassword !== confirmpassword) {
      return res.status(401).json({ Message: "Pasword Doesn't Match" });
    }
    const hash = await bcrypt.hash(confirmpassword, 10);
    await Jwt_User.findByIdAndUpdate({ _id: userid }, { password: hash });
    res.status(200).json({ Message: "Pasword Reset Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "Internal Server Error in Reseting the Password" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await Jwt_User.findById(userID);
    res.status(200).json({ Message: "Authorised User", data: [user] });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "Internal Server Error Failed to Fetch User" });
  }
};
