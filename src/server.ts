import app from "./app";
import { config } from "./config/config";
import connectDB from "./config/db";

const startServer = async () => {
	// Connect to the database
	await connectDB();

	const port = config.port || 3000;

	app.listen(port, () => {
		console.log("Server is running on port 3000");
	});
};

startServer();
