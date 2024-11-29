import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";

export interface AuthRequest extends Request {
	user_id: string;
}

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		const error = createHttpError(401, "Unauthorized Access Token");
		return next(error);
	}
	try {
		const decoded = jwt.verify(token, config.jwt_secret as string);
		// console.log(decoded);
		const _req = req as AuthRequest;
		_req.user_id = decoded.sub as string;
		// console.log(_req.user_id);
		next();
	} catch (error) {
		const err = createHttpError(401, "Unauthorized Access Token" + error);
		return next(err);
	}
};
