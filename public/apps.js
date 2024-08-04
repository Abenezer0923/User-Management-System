"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./router/index"));
const swagger_1 = require("./swagger"); // Import Swagger config
// Load environment variables from .env file
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
// CORS configuration to allow all origins
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        callback(null, true); // Always allow all origins
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept"
}));
// Set up Swagger UI
app.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
app.use("/api", index_1.default);
app.use((req, res) => {
    res.json({
        message: "NOT FOUND",
        code: 401,
    });
});
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is listening on port ${process.env.PORT || 8000}`);
});
exports.default = app;
