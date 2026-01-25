import express from "express";
import ejs from "ejs";
import cors from "cors";
import router from "./routes";
import sgMail from "@sendgrid/mail";
import mongoose from "mongoose";
import * as admin from "firebase-admin";
import { fbServiceAccount } from "./firebase-config";
import setupSwagger from "../swagger";

// Fix BigInt JSON issue
declare global {
  interface BigInt {
    toJSON: () => string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

// ✅ Set SendGrid API key safely
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// ✅ MongoDB connection (cached for Vercel cold starts)
const dbURI = process.env.DATABASE_URI;

if (!dbURI) {
  console.warn("⚠️ DATABASE_URI is not set");
} else {
  mongoose
    .connect(dbURI)
    .then(() => {
      require("./database/schema");
      console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
    });
}

// ✅ Firebase Admin Init (prevent re-init in serverless)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(
        fbServiceAccount as admin.ServiceAccount
      ),
      storageBucket: process.env.FB_STORAGE_BUCKET || "gs://test-storage-7acfd.appspot.com",
    });
    console.log("✅ Firebase initialized");
  } catch (error: any) {
    console.error("❌ Firebase init error:", error.message);
  }
}

// ✅ CORS (Vercel-friendly)
const corsOptions = {
  origin: [
    "https://schoolprep-fe.vercel.app",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const server = express();

server.use(cors(corsOptions));
server.options("*", cors(corsOptions));

// Body parsing
server.use(express.urlencoded({ limit: "50mb", extended: true }));
server.use(express.json({ limit: "50mb" }));

// EJS setup
server.engine("html", ejs.renderFile);
server.set("view engine", "ejs");

// Health route for Vercel testing
server.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend running 🚀" });
});

// Routes
server.use("/api", router);

// Swagger
setupSwagger(server);

export default server;
