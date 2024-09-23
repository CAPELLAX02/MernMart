import mongoose from 'mongoose';

const mongoUri: string = process.env.MONGO_URI || '';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
