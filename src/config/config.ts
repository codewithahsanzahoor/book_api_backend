import { config as configEnv } from "dotenv";

configEnv();

const _config = {
	port: process.env.PORT,
	database_url: process.env.MONGO_CONNECTION_STRING,
};

export const config = Object.freeze(_config);
