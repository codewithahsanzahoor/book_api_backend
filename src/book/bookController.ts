import { NextFunction, Request, Response } from "express";

export const createBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log(req.files);
	res.json({
		success: true,
	});
};
