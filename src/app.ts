import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();

app.get("/", (req, res) => {
	res.json({ message: "Hello World!" });
});

app.use("/api/users", userRouter);

app.use(globalErrorHandler);

export default app;
