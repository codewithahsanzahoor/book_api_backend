export interface Book {
	save(): unknown;
	_id: string;
	title: string;
	author: string;
	genre: string;
	coverImage: string;
	file: string;
	createdAt: Date;
	updatedAt: Date;
}
