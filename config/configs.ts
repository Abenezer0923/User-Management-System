import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const configs = {
  port:process.env.PORT || 4000,
  connectionString: process.env.MONGODB_CONNECTION_STRING || '',
  secret: process.env.JWT_SECRET || '',
};

export default configs;
