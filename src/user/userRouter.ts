import express from "express";
import { userCreate, userLogin } from "./userController";
const userRouter = express.Router();

userRouter.post("/register", userCreate);

userRouter.post("/login", userLogin);

export default userRouter;
