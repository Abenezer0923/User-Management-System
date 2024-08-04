import express, { Request, Response } from "express";
import configs from "./config/configs";
import session from "express-session";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import cors from "cors";
import useragent from "express-useragent";
import connectDB from "./config/db";
import dotenv from "dotenv";
import apiEndPoints from "./router/index";
import { swaggerUi, swaggerSpec } from './swagger'; // Import Swagger config

// Load environment variables from .env file
dotenv.config();

connectDB();

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

const app = express();

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

app.listen(configs.port, () => {
  console.log("listening on *: " + configs.port);
});

export default app; 