import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "./userModel";
import bcrypt from "bcrypt";

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

	// check if email already exists
	const checkEmail = await User.findOne({ email });
	if (checkEmail) {
		const error = createHttpError(400, "Email already exists");
		return next(error);
	}

	// hash password:
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = new User({ name, email, password: hashedPassword });
	try {
		await user.save();
	} catch (error) {
		const err = createHttpError(500, "Failed to create user: " + error);
		return next(err);
	}

	// process
	// response
	res.status(201).json({ message: "User created successfully" });
};
