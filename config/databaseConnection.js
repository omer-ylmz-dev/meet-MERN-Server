import mongoose from "mongoose";


export const databaseConnection = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB CONNECTED !");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
