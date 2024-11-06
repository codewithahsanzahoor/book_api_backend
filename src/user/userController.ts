import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "./userModel";

export const userCreate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, email, password } = req.body;
	// validate request body for user registration
	if (!name || !email || !password) {
		const error = createHttpError(
			400,
			"name, email and password are required"
		);
		return next(error);
	}

	const checkEmail = await User.findOne({ email });
	if (checkEmail) {
		const error = createHttpError(400, "Email already exists");
		return next(error);
	}

	// process
	// response
	res.status(201).json({ message: "User created successfully" });
};
