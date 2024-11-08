import { NextFunction, Request, Response } from "express";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";

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
		console.log("🚀 ~ uploadResult:", uploadResult);

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
		console.log("🚀 ~ pdfUploadResult:", pdfUploadResult);

		res.json({});
	} catch (error) {
		const err = createHttpError(500, "Failed to create book: " + error);
		// res.json({ err });
		return next(err);
	}
};
