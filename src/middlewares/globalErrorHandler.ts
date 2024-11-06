import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
	err: HttpError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		message: err.message,
		stack: config.node_env !== "production" ? err.stack : undefined,
	});
};

export default globalErrorHandler;
