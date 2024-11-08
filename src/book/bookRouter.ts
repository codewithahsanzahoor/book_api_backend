import express from "express";

import { createBook } from "./bookController";
import uploadMulter from "../middlewares/multer";
const bookRouter = express.Router();

bookRouter.post(
	"/",
	uploadMulter.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "file", maxCount: 1 },
	]),
	createBook
);

export default bookRouter;
