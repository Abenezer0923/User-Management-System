import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const configs = {
  port: parseInt(process.env.PORT || '3000', 10),
  connectionString: process.env.MONGODB_CONNECTION_STRING || '',
  secret: process.env.JWT_SECRET || '',
};

export default configs;
