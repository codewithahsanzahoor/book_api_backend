import multer from "multer";
import path from "path";

//setup multer for post request for createBook for fields coverImage and file:
const uploadMulter = multer({
	dest: path.resolve(__dirname, "..", "..", "public", "data", "uploads"),
	limits: { fileSize: 10e6 },
});

export default uploadMulter;
