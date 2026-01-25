import express from "express";
import cors from "cors";
import router from "./server/routes/index";


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
