import { config as configEnv } from "dotenv";

configEnv();

const _config = {
	port: process.env.PORT,
};

export const config = Object.freeze(_config);
