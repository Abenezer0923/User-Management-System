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

// Define allowed origins for CORS
const allowlist = ["http://localhost", "http://localhost:3000"];

const corsOptionsDelegate = (
  req: express.Request,
  callback: (err: Error | null, options?: cors.CorsOptions) => void
) => {
  let corsOptions: cors.CorsOptions;
  if (allowlist.includes(req.header("Origin")!)) {
    corsOptions = { origin: true }; // Reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // Disable CORS for this request
  }

  callback(null, corsOptions); // Callback expects two parameters: error and options
};

app.use(useragent.express());
app.use(cors(corsOptionsDelegate));
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));
app.use(bodyParser.json({ type: "application/json", limit: "50mb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION_STRING || "", 
    }),
  })
);

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
