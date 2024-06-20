import express from "express";
import {
  forgetPassword,
  getUser,
  loginUser,
  registerUser,
  resetPassword,
} from "../Controllers/userController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:id", resetPassword);
router.get("/get-user", authMiddleware, getUser);
export default router;
