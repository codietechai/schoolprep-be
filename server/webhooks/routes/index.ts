import * as express from "express";
import stripeRouter from "./stripe";
import PaymentsController from "user/controllers/payments/controller";

const router = express.Router();

const {
    listenStripeWebHook,
} = PaymentsController;

router.use("/stripe", stripeRouter);
router.post("/testprep-payment-webhook", listenStripeWebHook);

export default router;
