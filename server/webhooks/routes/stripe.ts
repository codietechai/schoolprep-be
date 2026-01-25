import * as express from "express";
import WebhookController from "../controllers/webhook.controller";

const router = express.Router();

const { syncSubscription } = WebhookController;

router.post("/sync-subscription", syncSubscription);

export default router;
