import mongoose from "mongoose";

const connectDB = async () => {
	try {
		mongoose.connection.on("connected", () => {
			console.log("Connected to MongoDB database");
		});

		mongoose.connection.on("error", (err) => {
			console.error("MongoDB connection error:", err);
			process.exit(1);
		});

		await mongoose.connect(process.env.MONGO_CONNECTION_STRING as string);
	} catch (error) {
		console.error("MongoDB connection error :", error);
		process.exit(1);
	}
};

export default connectDB;
