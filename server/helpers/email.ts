
import { CONFIG } from "config";
import SibApiV3Sdk from "sib-api-v3-sdk";

export enum TemplateId {
    OtpCode = 1,
    ForgotPassword = 2,
}

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKeyAuth = defaultClient.authentications["api-key"];
apiKeyAuth.apiKey = CONFIG.BREVO_API_KEY || "";

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async (
    receiverEmail: string,
    templateId: TemplateId,
    params: Record<string, any>,
    attachments?: { name: string; content: string }[]
): Promise<void> => {
    try {
        console.log("params", params);
        const sendSmtpEmail = {
            to: [{ email: receiverEmail }],
            sender: {
                email: CONFIG.BREVO_SENDER_EMAIL || "no-reply@yourdomain.com",
                name: "Your Brand",
            },
            templateId,
            params,
            ...(attachments && { attachment: attachments }),
        };

        const result = await emailApi.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent:", result);
    } catch (err: any) {
        console.error("Brevo sendEmail error:", err.response?.text || err);
        throw err;
    }
};
