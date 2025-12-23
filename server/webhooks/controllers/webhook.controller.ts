import { NextFunction, Request, Response } from "express";
import { sendResponse } from "admin/helpers";
import { RESPONSE_TYPE, ERROR_MESSAGE } from "admin/constants";
// import WebhookService from "webhooks/controllers/webhook.service";
import { CONFIG } from "config";
import Stripe from "stripe";

const stripe = new Stripe(CONFIG.STRIPE_SECRET_KEY, {
    apiVersion: CONFIG.STRIPE_API_VERSION as any,
});

const endpointSecret = CONFIG.STRIPE_WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};

const constructEvent = (req) => {
    const sig = req.headers["stripe-signature"];
    const body = req.body;

    try {
        return stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (error) {
        throw new Error(
            `Webhook signature verification failed: ${error.message}`
        );
    }
};

export default class WebhookController {
    static async syncSubscription(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const event = constructEvent(req);

            switch (event.type) {
                case "checkout.session.completed":
                    const session = event.data.object;
                    console.log("Payment successful:", session);
                    break;
                case "invoice.payment_failed":
                    const invoice = event.data.object;
                    console.log("Payment failed:", invoice);
                    break;
                default:
                    console.log("Unhandled event:", event.type);
            }

            return res.status(200).send("Webhook received");
        } catch (err) {
            console.log("Paypal webhook error", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
