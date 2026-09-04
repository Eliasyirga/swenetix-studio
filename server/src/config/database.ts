import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[Database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('[Database] Connection failed:', error);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
};
