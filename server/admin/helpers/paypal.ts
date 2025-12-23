import axios from "axios";
import { CONFIG } from "config";

export const generateAccessToken = async () => {
    try {
        const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_URL } =
            CONFIG;
        const base = PAYPAL_BASE_URL;

        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
        ).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};

export const handleResponse = async (response) => {
    try {
        const jsonResponse = await response.json();
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
};

export const createPaypalSubscription = async (data: any) => {
    try {
        const userAction = "SUBSCRIBE_NOW";
        const url = `${CONFIG.PAYPAL_BASE_URL}/v1/billing/subscriptions`;
        const accessToken = await generateAccessToken();
        const response = await axios.post(
            url,
            {
                application_context: {
                    user_action: userAction,
                },
                ...data,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                    Prefer: "return=representation",
                },
            }
        );
        return response?.data ?? null;
    } catch (err) {}
};

export const revisePaypalSubscription = async (data: any) => {
    try {
        const url = `${CONFIG.PAYPAL_BASE_URL}/v1/billing/subscriptions/${data.subscription_id}/revise`;
        const accessToken = await generateAccessToken();
        const response = await axios.post(
            url,
            {
                plan_id: data.plan_id,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                    Prefer: "return=representation",
                },
            }
        );
        return response?.data ?? null;
    } catch (err) {}
};

export const pausePaypalSubscription = async (
    subscription_id: string,
    reason: string
) => {
    try {
        const url = `${CONFIG.PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscription_id}/suspend`;
        const accessToken = await generateAccessToken();
        const response = await axios.post(
            url,
            {
                reason,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                    Prefer: "return=representation",
                },
            }
        );
        return response?.data ?? null;
    } catch (err) {}
};

export const activatePaypalSubscription = async (
    subscription_id: string,
    reason: string
) => {
    try {
        const url = `${CONFIG.PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscription_id}/activate`;
        const accessToken = await generateAccessToken();
        const response = await axios.post(
            url,
            {
                reason,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                    Prefer: "return=representation",
                },
            }
        );
        return response?.data ?? null;
    } catch (err) {}
};

export const cancelPaypalSubscription = async (
    subscription_id: string,
    reason: string
) => {
    try {
        const url = `${CONFIG.PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscription_id}/cancel`;
        const accessToken = await generateAccessToken();
        const response = await axios.post(
            url,
            {
                reason,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                    Prefer: "return=representation",
                },
            }
        );
        return response?.data ?? null;
    } catch (err) {}
};

export const fetchPaypalSubscription = async (id: string) => {
    try {
        const url = `${CONFIG.PAYPAL_BASE_URL}/v1/billing/subscriptions/${id}`;
        const accessToken = await generateAccessToken();
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response?.data ?? null;
    } catch (err) {}
};
