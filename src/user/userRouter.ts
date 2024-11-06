import express from "express";
import { userCreate } from "./userController";
const userRouter = express.Router();

userRouter.get("/register", userCreate);

export default userRouter;
