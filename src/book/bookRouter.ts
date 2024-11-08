import express from "express";

import { createBook } from "./bookController";
import uploadMulter from "../middlewares/multer";
import { authenticate } from "../middlewares/authentication";
const bookRouter = express.Router();

bookRouter.post(
	"/",
	authenticate,
	uploadMulter.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "file", maxCount: 1 },
	]),
	createBook
);

export default bookRouter;
