import express from "express";
import {
	bookReaderAll,
	createBook,
	deleteBook,
	singleBookReader,
	updateBook,
} from "./bookController";
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

bookRouter.put(
	"/:id",
	authenticate,
	uploadMulter.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "file", maxCount: 1 },
	]),
	updateBook
);

bookRouter.get("/:bookId", singleBookReader);
bookRouter.get("/", bookReaderAll);

bookRouter.delete("/:id", authenticate, deleteBook);

export default bookRouter;
