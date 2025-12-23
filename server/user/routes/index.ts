import * as express from "express";
import authRouter from "./auth";
import contactRouter from "./contact";
import paymentsRouter from "./payments";

const router = express.Router();

router.use("/", authRouter);
router.use("/contact", contactRouter);
router.use("/payment", paymentsRouter);

export default router;
