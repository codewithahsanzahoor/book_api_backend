import { NextFunction, Request, Response } from "express";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { Book } from "./bookTypes";

export const createBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
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

		let book: Book;
		try {
			book = new bookModel({
				title: req.body.title,
				author: req.body.author,
				pages: req.body.pages,
				coverImage: uploadResult.secure_url,
				file: pdfUploadResult.secure_url,
				genre: req.body.genre,
			});

			await book.save();
		} catch (error) {
			const err = createHttpError(500, "Failed to save book: " + error);
			return next(err);
		}

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

		res.status(201).json({ book });
	} catch (error) {
		const err = createHttpError(500, "Failed to create book: " + error);
		// res.json({ err });
		return next(err);
	}
};
