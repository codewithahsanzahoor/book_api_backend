import { config as configEnv } from "dotenv";

configEnv();

const _config = {
	port: process.env.PORT,
	database_url: process.env.MONGO_CONNECTION_STRING,
	node_env: process.env.ENV,
};

export const config = Object.freeze(_config);
