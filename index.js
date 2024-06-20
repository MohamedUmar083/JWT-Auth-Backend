import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import userRouter from "./Router/userRouter.js";
dotenv.config();

const app = express();
//middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//Database
connectDB();

//Defaultroutes
app.get("/", (req, res) => {
  res.status(200).send("This Api Works Good");
});

//Api Routes
app.use("/api/user", userRouter);
//Listen
app.listen(process.env.PORT, () => {
  console.log("App is Running Successfully");
});
