"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: 'server/.env' });
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require("reflect-metadata");
const datasource_1 = require("./datasource");
// import patientRoutes from "./routes/patientRoutes"; // Import the patient routes
const port = process.env.PORT || 5001;
const otpRoutes_1 = __importDefault(require("./routes/otpRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const corsOptions = {
    origin: ['http://localhost:3000', 'https://thriving-bonbon-27d691.netlify.app', 'https://app.vitalx.in', 'https://dev.vitalx.in', 'https://admirable-taiyaki-b2b323.netlify.app', 'https://beta.vitalx.in'],
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // some legacy browsers (IE11, various SmartTVs) choke on 204,
    allowedHeaders: "Content-Type, Authorization, X-Custom-Header",
};
datasource_1.AppDataSource.initialize()
    .then(() => {
    // Set up CORS and JSON parsing middleware
    app.use(cors(corsOptions));
    app.use(express.json());
    // Set up routes
    // app.use('/patients', patientRoutes); // Use the patient routes
    app.use('/auth', otpRoutes_1.default); //for OTP routes
    app.use('/auth', authRoutes_1.default);
    // Set up the HTTP and WebSocket server
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Restrict this in production
            methods: ["GET", "POST"],
        }
    });
    // WebSocket logic
    // io.on('connection', (socket) => {
    //     // ... WebSocket event handlers ...
    // });
    // Start the HTTP server
    httpServer.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
    .catch((error) => console.error("Error during Data Source initialization", error));
// ... dotenv config and corsOptions ...
// The rest of your server setup, such as error handling middleware, etc.
