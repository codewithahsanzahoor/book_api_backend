import express from "express";
import { userCreate } from "./userController";
const userRouter = express.Router();

userRouter.post("/register", userCreate);

export default userRouter;
