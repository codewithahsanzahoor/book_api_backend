import { config as configEnv } from "dotenv";

configEnv();

const _config = {
	port: process.env.PORT,
	database_url: process.env.MONGO_CONNECTION_STRING,
	node_env: process.env.ENV,
	jwt_secret: process.env.JWT_SECRET,
	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
