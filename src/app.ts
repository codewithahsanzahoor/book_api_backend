import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import morgan from "morgan";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();
app.use(
	cors({
		origin: config.frontend_url,
	})
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Welcome to Ebook API Backend",
	});
});

app.use(globalErrorHandler);
export default app;
