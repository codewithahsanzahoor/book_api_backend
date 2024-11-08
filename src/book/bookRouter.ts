import express from "express";

import { createBook } from "./bookController";
import multer from "multer";
import path from "path";
const bookRouter = express.Router();

//setup multer for post request for createBook for fields coverImage and file:
const uploadMulter = multer({
	dest: path.resolve(__dirname, "..", "..", "public", "data", "uploads"),
	limits: { fileSize: 3e7 },
});

bookRouter.post(
	"/",
	uploadMulter.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "file", maxCount: 1 },
	]),
	createBook
);

export default bookRouter;
