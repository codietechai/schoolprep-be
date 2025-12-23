import { Router } from "express";
import adminRouter from "../admin/routes";
import userRouter from "../user/routes";
import webhookRouter from "../webhooks/routes";

const router = Router();

// ====== Admin route ======
router.use("/admin", adminRouter);

// ====== User routes ======
router.use("/user", userRouter); // DONE

router.use("/webhook", webhookRouter); // DONE

export default router;
