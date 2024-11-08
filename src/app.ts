import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import morgan from "morgan";

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/users", userRouter);

app.use(globalErrorHandler);

export default app;
