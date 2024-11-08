import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User as UserType } from "./userTypes";

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
	let checkEmail;
	try {
		checkEmail = await User.findOne({ email });
	} catch (error) {
		return next(createHttpError(500, "Failed to check email: " + error));
	}
	if (checkEmail) {
		const error = createHttpError(400, "Email already exists");
		return next(error);
	}

	// hash password:
	const hashedPassword = await bcrypt.hash(password, 10);

	// create user in database with hashed password
	let user: UserType;
	try {
		user = new User({ name, email, password: hashedPassword });
		await user.save();
	} catch (error) {
		const err = createHttpError(500, "Failed to create user: " + error);
		return next(err);
	}

	// generating web token for user
	try {
		const token = sign(
			{
				sub: user._id,
			},
			config.jwt_secret as string,
			{
				expiresIn: "1d",
			}
		);

		res.status(201).json({ message: "User created successfully", token });
	} catch (error) {
		return next(
			createHttpError(500, "Failed to create token for user: " + error)
		);
	}
};

export const userLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;
	// validate request body for user login
	if (!email || !password) {
		const error = createHttpError(400, "email and password are required");
		return next(error);
	}

	// check if email exists
	let user: UserType | null;

	try {
		user = await User.findOne({ email });
	} catch (error) {
		return next(createHttpError(500, "Failed to check email: " + error));
	}
	if (!user) {
		const error = createHttpError(404, "User not found");
		return next(error);
	}

	// check if password is correct
	const isPasswordCorrect = await bcrypt.compare(password, user.password);
	if (!isPasswordCorrect) {
		const error = createHttpError(401, "Incorrect username or password");
		return next(error);
	}

	// generating web token for user
	try {
		const token = sign(
			{
				sub: user._id,
			},
			config.jwt_secret as string,
			{
				expiresIn: "1d",
			}
		);

		res.status(200).json({ message: "User logged in successfully", token });
	} catch (error) {
		return next(
			createHttpError(500, "Failed to create token for user: " + error)
		);
	}
};
