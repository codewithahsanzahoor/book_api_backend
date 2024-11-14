import { User } from "../user/userTypes";

export interface Book {
	save(): unknown;
	_id: string;
	title: string;
	author: User;
	genre: string;
	coverImage: string;
	file: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
}
