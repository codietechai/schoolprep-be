import express from "express";
import ejs from "ejs";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import mongoose from "mongoose";
import * as admin from "firebase-admin";
import router from "server/routes";

const server = express();

// health route
server.get("/api/health", (req, res) => {
  res.json({ status: "ok from vercel" });
});

// cors
server.use(cors());
server.use(express.json());
server.use("/api", router);

export default server;
