import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
