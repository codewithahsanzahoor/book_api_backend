import { NextFunction, Request, Response } from "express";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { Book } from "./bookTypes";
import { AuthRequest } from "../middlewares/authentication";
import mongoose from "mongoose";

export const createBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const _req = req as AuthRequest;
		if (!_req.user_id) {
			const error = createHttpError(401, "Unauthorized Access Token");
			return next(error);
		}

		const files = req.files as {
			[fieldname: string]: Express.Multer.File[];
		};
		const coverImageMimeType = files["coverImage"][0].mimetype
			.split("/")
			.at(-1);
		const fileName = files.coverImage[0].filename;
		const filePath = path.resolve(
			__dirname,
			"..",
			"..",
			"public",
			"data",
			"uploads",
			fileName
		);

		const uploadResult = await cloudinary.uploader.upload(filePath, {
			filename_override: fileName,
			folder: "books-cover",
			resource_type: "image",
			mimetype: coverImageMimeType,
		});
		// console.log("🚀 ~ uploadResult:", uploadResult);

		const fileMimeType = files["file"][0].mimetype.split("/").at(-1);
		const pdfFileName = files.file[0].filename;
		const pdfFilePath = path.resolve(
			__dirname,
			"..",
			"..",
			"public",
			"data",
			"uploads",
			pdfFileName
		);

		const pdfUploadResult = await cloudinary.uploader.upload(pdfFilePath, {
			filename_override: pdfFileName,
			folder: "books-pdf",
			resource_type: "raw",
			mimetype: fileMimeType,
			format: "pdf",
		});
		// console.log("🚀 ~ pdfUploadResult:", pdfUploadResult);

		// remove temporary file from uploads folder:
		try {
			await fs.promises.unlink(filePath);
			await fs.promises.unlink(pdfFilePath);
		} catch (error) {
			const err = createHttpError(
				500,
				"Failed to remove temporary files from uploads folder: " + error
			);
			// res.json({ err });
			return next(err);
		}

		let book: Book;
		try {
			book = new bookModel({
				title: req.body.title,
				author: _req.user_id,
				pages: req.body.pages,
				coverImage: uploadResult.secure_url,
				file: pdfUploadResult.secure_url,
				genre: req.body.genre,
				description: req.body.description,
			});

			await book.save();

			res.status(201).json({ id: book._id });
		} catch (error) {
			const err = createHttpError(500, "Failed to save book: " + error);
			return next(err);
		}
	} catch (error) {
		const err = createHttpError(500, "Failed to create book: " + error);
		// res.json({ err });
		return next(err);
	}
};

export const updateBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.params.id) {
		const error = createHttpError(400, "book id is required");
		return next(error);
	}

	// authorize user
	const _req = req as AuthRequest;
	const bookId = req.params.id;
	const book = await bookModel.findOne({ _id: bookId, author: _req.user_id });
	if (!book) {
		const error = createHttpError(
			401,
			"Unauthorized Access to update book"
		);
		return next(error);
	}

	// cloudinary upload files if needed (cover image and pdf file) check if files are uploaded:
	const files = req.files as {
		[fieldname: string]: Express.Multer.File[];
	};
	let completeCoverImageUpload = "";
	if (files["coverImage"]) {
		const coverImageMimeType = files["coverImage"][0].mimetype
			.split("/")
			.at(-1);
		const fileName = files.coverImage[0].filename;
		const filePath = path.resolve(
			__dirname,
			"..",
			"..",
			"public",
			"data",
			"uploads",
			fileName
		);

		const uploadResult = await cloudinary.uploader.upload(filePath, {
			filename_override: fileName,
			folder: "books-cover",
			resource_type: "image",
			mimetype: coverImageMimeType,
		});
		completeCoverImageUpload = uploadResult.secure_url;

		// remove temporary file from uploads folder and delete files from cloudinary:
		const imageId =
			book.coverImage.split("/").at(-2) +
			"/" +
			book.coverImage.split("/").at(-1)?.split(".")[0];

		try {
			await cloudinary.uploader.destroy(imageId);
		} catch (error) {
			const err = createHttpError(
				500,
				"Failed to delete files from cloudinary imageId: " + error
			);
			return next(err);
		}

		// remove temporary file from uploads folder:
		try {
			await fs.promises.unlink(filePath);
		} catch (error) {
			const err = createHttpError(
				500,
				"Failed to remove temporary files from uploads folder: " + error
			);
			// res.json({ err });
			return next(err);
		}
		// console.log("🚀 ~ uploadResult:", uploadResult);
	}

	let completePdfFileUpload = "";

	if (files["file"]) {
		const fileMimeType = files["file"][0].mimetype.split("/").at(-1);
		const pdfFileName = files.file[0].filename;
		const pdfFilePath = path.resolve(
			__dirname,
			"..",
			"..",
			"public",
			"data",
			"uploads",
			pdfFileName
		);

		const pdfUploadResult = await cloudinary.uploader.upload(pdfFilePath, {
			filename_override: pdfFileName,
			folder: "books-pdf",
			resource_type: "raw",
			mimetype: fileMimeType,
			format: "pdf",
		});

		completePdfFileUpload = pdfUploadResult.secure_url;

		// remove temporary file from uploads folder and delete files from cloudinary:
		const pdfId =
			book.file.split("/").at(-2) + "/" + book.file.split("/").at(-1);
		try {
			await cloudinary.uploader.destroy(pdfId, { resource_type: "raw" });
		} catch (error) {
			const err = createHttpError(
				500,
				"Failed to delete files from cloudinary pdfId: " + error
			);
			return next(err);
		}

		// remove temporary file from uploads folder:
		try {
			await fs.promises.unlink(pdfFilePath);
		} catch (error) {
			const err = createHttpError(
				500,
				"Failed to remove temporary files from uploads folder: " + error
			);
			// res.json({ err });
			return next(err);
		}
	}

	try {
		const updatedBook = await bookModel.findOneAndUpdate(
			{ _id: bookId },
			{
				...req.body,
				coverImage: completeCoverImageUpload
					? completeCoverImageUpload
					: book.coverImage,
				file: completePdfFileUpload ? completePdfFileUpload : book.file,
			},
			{ new: true }
		);
		if (!updatedBook) {
			const error = createHttpError(404, "Book not found");
			return next(error);
		}
		res.status(200).json({ id: updatedBook._id });
	} catch (error) {
		const err = createHttpError(500, "Failed to update book: " + error);
		return next(err);
	}
};

export const singleBookReader = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const bookParamsId = req.params.bookId;
	try {
		const book = await bookModel
			.findById(bookParamsId)
			.populate({ path: "author", select: "name" });
		if (!book) {
			const error = createHttpError(404, "Book not found");
			return next(error);
		}
		res.status(200).json(book);
	} catch (error) {
		const err = createHttpError(500, "Failed to get book: " + error);
		return next(err);
	}
};

export const bookReaderAll = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const books = await bookModel.find().populate({
			path: "author",
			select: "name",
		});
		if (books.length === 0) {
			const error = createHttpError(404, "No books found");
			return next(error);
		}
		res.status(200).json(books);
	} catch (error) {
		const err = createHttpError(500, "Failed to get all books: " + error);
		return next(err);
	}
};

export const deleteBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const _req = req as AuthRequest;
	const authorId = _req.user_id;
	const bookId = req.params.id;

	try {
		const book = await bookModel.findOne({ _id: bookId });
		if (!book) {
			const error = createHttpError(404, "Book not found");
			return next(error);
		}
		if (book.author.toString() !== authorId) {
			const error = createHttpError(
				403,
				"You are not authorized to delete this book"
			);
			return next(error);
		}

		// delete files from cloudinary
		const imageId =
			book.coverImage.split("/").at(-2) +
			"/" +
			book.coverImage.split("/").at(-1)?.split(".")[0];

		const pdfId =
			book.file.split("/").at(-2) + "/" + book.file.split("/").at(-1);
		// console.log("🚀 ~ imageId:", imageId);
		// console.log("🚀 ~ pdfId:", pdfId);

		try {
			await cloudinary.uploader.destroy(imageId);
		} catch (error) {
			const err = createHttpError(
				500,
				"Failed to delete files from cloudinary imageId: " + error
			);
			return next(err);
		}
		try {
			await cloudinary.uploader.destroy(pdfId, { resource_type: "raw" });
		} catch (error) {
			const err = createHttpError(
				500,
				"Failed to delete files from cloudinary pdfId: " + error
			);
			return next(err);
		}

		// delete book from database
		try {
			await bookModel.findOneAndDelete({ _id: bookId });
		} catch (error) {
			const err = createHttpError(
				500,
				"Failed to delete book from database: " + error
			);
			return next(err);
		}
		res.status(200).json({
			id: bookId,
		});
	} catch (error) {
		const err = createHttpError(500, "Failed to delete book: " + error);
		return next(err);
	}
};

export const authorBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const _req = req as AuthRequest;
	const authorId = _req.user_id;

	// Validate the authorId
	if (!mongoose.Types.ObjectId.isValid(authorId)) {
		return next(createHttpError(400, "Invalid author id"));
	}

	try {
		// Query the database for books by the author
		const books = await bookModel.find({ author: authorId });

		// Handle no books found
		if (books.length === 0) {
			return next(createHttpError(404, "No books found for this author"));
		}

		// Respond with the books
		res.status(200).json(books);
	} catch (error) {
		// Handle database query errors
		return next(createHttpError(500, "Failed to get books: " + error));
	}
};

export const booksPerPages = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const _req = req as AuthRequest;
	const authorId = _req.user_id;
	// Validate the authorId
	if (!mongoose.Types.ObjectId.isValid(authorId)) {
		return next(createHttpError(400, "Invalid author id"));
	}

	const limit = parseInt(req.query.limit as string) || 3;
	const page = parseInt(req.query.page as string) || 1;
	const offset = (page - 1) * limit;

	// console.log(`Limit: ${limit}, Page: ${page}, Offset: ${offset}`);

	if (isNaN(limit) || limit <= 0) {
		return next(createHttpError(400, "Limit must be a positive number."));
	}

	if (isNaN(page) || page <= 0) {
		return next(createHttpError(400, "Page must be a positive number."));
	}

	try {
		let books = await bookModel
			.find({ author: authorId })
			.populate({
				path: "author",
			})
			.skip(offset)
			.limit(limit)
			.exec();
		const totalPages = Math.ceil(
			(await bookModel.countDocuments()) / limit
		);
		const currentPage = page;
		if (books.length === 0) {
			books = [];
		}
		res.status(200).json({
			books,
			pagination: {
				totalPages,
				currentPage,
				itemsPerPage: limit,
			},
		});
	} catch (error) {
		const err = createHttpError(
			500,
			"Failed to get books per page: " + error
		);
		return next(err);
	}
};
