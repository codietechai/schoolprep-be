import { Router } from "express";
import adminRouter from "../admin/routes/index";
import userRouter from "../user/routes/index";
import webhookRouter from "../webhooks/routes/index";

const router = Router();

// ====== Admin route ======
router.use("/admin", adminRouter);

// ====== User routes ======
router.use("/user", userRouter); // DONE

router.use("/webhook", webhookRouter); // DONE

export default router;
