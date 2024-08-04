import express, { Request, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import cors from "cors";
import useragent from "express-useragent";
import connectDB from "./config/db";
import dotenv from "dotenv";
import apiEndPoints from "./router/index";
import { swaggerUi, swaggerSpec } from './swagger'; // Import Swagger config

// Load environment variables from .env file
dotenv.config();

connectDB();

const app = express();

// CORS configuration to allow all origins
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Always allow all origins
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept"
}));

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/content", express.static(__dirname + "/content"));
app.use("/public", express.static(__dirname + "/public"));

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", apiEndPoints);

app.use((req: Request, res: Response) => {
  res.json({
    message: "NOT FOUND",
    code: 401,
  });
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is listening on port ${process.env.PORT || 8000}`);
});

export default app;
