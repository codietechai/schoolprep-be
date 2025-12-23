import * as express from "express";
import PaymentsController from "user/controllers/payments/controller";
import {
    validateCreateCheckoutSessionBody,
} from "user/controllers/payments/validation";

const router = express.Router();

const {
    createCheckoutSession,
    listenStripeWebHook,
    fetchStripePlans,
    getSubscriptionDetails
} = PaymentsController;

router.post("/create-checkout-session", validateCreateCheckoutSessionBody, createCheckoutSession);
router.post("/testprep-payment-webhook", listenStripeWebHook);
router.get("/fetch-plans", fetchStripePlans);
router.get("/subscription-details", getSubscriptionDetails);

export default router;
