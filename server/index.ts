import express from "express";
import ejs from "ejs";
import cors from "cors";
import router from "./routes";
import sgMail from "@sendgrid/mail";
const mongoose = require('mongoose');
import * as admin from "firebase-admin";
import { fbServiceAccount } from "./firebase-config";
const setupSwagger = require('../swagger');

declare global {
    interface BigInt {
        toJSON: () => string;
    }
}
BigInt.prototype.toJSON = function () {
    return this.toString();
};

// Set sendgrid api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Database connection
const dbURI = process.env.DATABASE_URI;
mongoose.connect(dbURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
    .then(() => {
        require("./database/schema");
        console.log('Successfully connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

try {
    admin.initializeApp({
        credential: admin.credential.cert(
            fbServiceAccount as admin.ServiceAccount
        ),
        storageBucket: "gs://test-storage-7acfd.appspot.com",
    });
    console.log("Firebase app has been initialized successfully");
} catch (error) {
    console.error("Failed to initialize Firebase app:", error);
    throw new Error(error.message);
}

const corsOptions = {
    origin: [
        "https://schoolprep-fe.vercel.app",
        "http://localhost:3000", // optional for local dev
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

const server = express();
server.use(cors(corsOptions));
server.options("*", cors(corsOptions)); // 👈 important for preflight

server.use(
    express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
server.use(express.json({ limit: "50mb" }));
server.engine("html", ejs.renderFile);
server.set("view engine", "ejs");
server.use("/api", router);

setupSwagger(server);

export default server;
