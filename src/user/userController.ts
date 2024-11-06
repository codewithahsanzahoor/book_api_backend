import { NextFunction, Request, Response } from "express";

export const userCreate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(200).json({
		message: "Hello World from user controller in userRouter",
	});
};
