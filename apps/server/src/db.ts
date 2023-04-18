import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongodb: string = process.env.MONGODB_URI as string;

export const dbConnect = async () => {
  try {
    mongoose.set('strictQuery', false);
    const db = await mongoose.connect(mongodb);
    console.log('Database connected to ', db.connection.db.databaseName);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      process.exit(1);
    }
  }
};
