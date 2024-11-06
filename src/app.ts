import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.get("/", (req, res) => {
	res.json({ message: "Hello World!" });
});

app.use(globalErrorHandler);

export default app;
