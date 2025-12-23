// import dayjs from "dayjs";
// import SubscriptionService from "user/controllers/subscription/subscription.service";
// import AuthService from "user/controllers/auth/auth.service";
// import { fetchPaypalSubscription } from "admin/helpers";
// import { SUBSCRIPTION_TYPE, SUBSCRIPTION_STATUS } from "../../constants";
// import { sendInvoiceEmail } from "helpers";
// import {
//     fetchFattureClient,
//     createFattureClient,
//     createFattureInvoice,
// } from "helpers";
// const ejs = require("ejs");
// const path = require("path");
// const pdf = require("html-pdf");
// const fs = require("fs");

// export default class WebhookService {
//     static async createInvoice(data) {
//         try {
//             const paypal_subscription_id = data?.resource?.billing_agreement_id;
//             console.log('>>>>>>> 1');
//             console.log('>>>>>>> data', data);
//             const subscription =
//                 await SubscriptionService.getActiveSubscriptionByPaypalId(
//                     paypal_subscription_id
//                 );
//                 console.log('>>>>>>> 2');

//             if (!subscription) {
//                 return false;
//             }

//             console.log('>>>>>>> 3');
//             if (subscription) {
//                 console.log('>>>>>>> subscription', subscription);
//                 const invoice = await SubscriptionService.createInvoice({
//                     user_id: subscription?.user_id,
//                     subscription_id: subscription?.id,
//                     plan_id: subscription?.plan_id,
//                     amount: data?.resource?.amount?.total,
//                     status: "paid",
//                 });
//                 console.log('>>>>>>> 4');
//                 const user = await AuthService.getUserById(
//                     subscription?.user_id
//                 );

//                 console.log('>>>>>>> 5');
//                 if (invoice && invoice?.id) {
//                     const planDetails = await SubscriptionService.getPlanById(
//                         subscription?.plan_id
//                     );
//                     console.log('>>>>>>> 6');
//                     const paypalSubscription = await fetchPaypalSubscription(
//                         paypal_subscription_id
//                     );
//                     console.log('>>>>>>> 7');
//                     let invoiceUser: any = null;
//                     const existingUser = await fetchFattureClient(user?.email);
//                     console.log('>>>>>>> 8');
//                     if (existingUser) {
//                         invoiceUser = existingUser;
//                     } else {
//                         invoiceUser = await createFattureClient({
//                             name: user?.full_name ?? user?.email,
//                             email: user?.email,
//                             address_street: user?.billing_street ?? "",
//                             address_postal_code: user?.billing_zip ?? "",
//                             address_city: user?.billing_city ?? "",
//                             country: user?.billing_country ?? "",
//                             phone: `${user?.phone_code}${user?.contact_number}`,
//                             tax_code: "",
//                         });
//                     }
//                     console.log('>>>>>>> 9');
//                     const fattureInvoice = await createFattureInvoice(
//                         {
//                             id: invoiceUser?.id,
//                             name: invoiceUser?.name,
//                             email: invoiceUser?.email,
//                             address_street: invoiceUser?.address_street,
//                             address_postal_code:
//                                 invoiceUser?.address_postal_code,
//                             address_city: invoiceUser?.address_city,
//                             country: invoiceUser?.country,
//                             phone: invoiceUser?.phone,
//                         },
//                         {
//                             subject: "Subscription Invoice",
//                             amount_net:
//                                 paypalSubscription?.billing_info?.last_payment
//                                     ?.amount?.value,
//                             number: invoice?.id,
//                             date: dayjs(new Date(invoice?.createdAt)).format(
//                                 "YYYY-MM-DD"
//                             ),
//                             payment_due_date: dayjs(
//                                 new Date(invoice?.createdAt)
//                             ).format("YYYY-MM-DD"),
//                             payment_paid_date: dayjs(
//                                 new Date(invoice?.createdAt)
//                             ).format("YYYY-MM-DD"),
//                             status: invoice?.status,
//                             plan: planDetails?.name,
//                         }
//                     );
//                     console.log('>>>>>>> 10');
//                     await SubscriptionService.updateInvoice(
//                         {
//                             fatture_invoice: fattureInvoice?.url ?? "",
//                         },
//                         invoice?.id
//                     );
//                     console.log('>>>>>>> 11');

//                     const pdfName = `invoice-${invoice?.id}.pdf`;
//                     const filePath = `/temp-pdf/${pdfName}`;

//                     const pdfPath = path.join(__dirname, "../../../", filePath);

//                     ejs.renderFile(
//                         path.join(__dirname, "../../../views/", "pdf/index.ejs"),
//                         {
//                             data: { invoice, subscription },
//                             issueDate: dayjs(data?.invoice?.createdAt).format(
//                                 "MMM DD YYYY"
//                             ),
//                         },
//                         (err, data) => {
//                             if (err) {
//                                 console.log('>>>>>>> pdf error', err);
//                             } else {
//                                 let options = {
//                                     header: {
//                                         height: "20mm",
//                                     },
//                                     footer: {
//                                         height: "20mm",
//                                     },
//                                 };
//                                 pdf.create(data, options).toFile(
//                                     `temp-pdf/${pdfName}`,
//                                     async function (err, data) {
//                                         if (err) {
//                                             console.log(err);
//                                         } else {
//                                             await sendInvoiceEmail(
//                                                 user?.email,
//                                                 subscription?.plan_name,
//                                                 [
//                                                     {
//                                                         content: fs
//                                                             .readFileSync(pdfPath)
//                                                             .toString("base64"),
//                                                         filename: "Invoice.pdf",
//                                                         type: "application/pdf",
//                                                         disposition: "attachment",
//                                                     },
//                                                 ]
//                                             );
//                                             setTimeout(() => {
//                                                 fs.unlinkSync(pdfPath);
//                                             }, 5000);
//                                         }
//                                     }
//                                 );
//                             }
//                         }
//                     );
//                 }
//             }

//             return true;
//         } catch (err) { }
//     }

//     static async updateSubscriptionType(data) {
//         try {
//             const paypal_subscription_id = data?.resource?.billing_agreement_id;
//             const paypalSubscription = await fetchPaypalSubscription(
//                 paypal_subscription_id
//             );
//             const planDetails = await SubscriptionService.getPlanByPaypalId(
//                 paypalSubscription?.plan_id
//             );
//             let type = "";
//             if (paypalSubscription?.plan_id === planDetails?.paypal_trial_id) {
//                 type = data?.resource?.cycle_completed > 1 ? SUBSCRIPTION_TYPE.PREMIUM : SUBSCRIPTION_TYPE.TRIAL;
//             } else if (
//                 paypalSubscription?.plan_id === planDetails?.paypal_regular_id
//             ) {
//                 type = SUBSCRIPTION_TYPE.PREMIUM;
//             }

//             const subscription =
//                 await SubscriptionService.getActiveSubscriptionByPaypalId(
//                     paypal_subscription_id
//                 );
//             if (subscription) {
//                 await SubscriptionService.updateSubscription(
//                     {
//                         type: type as any,
//                         active: true,
//                         status: SUBSCRIPTION_STATUS.ACTIVE as any,
//                     },
//                     subscription?.id
//                 );
//             }

//             return true;
//         } catch (err) {
//             console.error("Webhook Error: ", err);
//         }
//     }

//     static async updateRecurringSubscription(data) {
//         try {
//             const paypal_subscription_id = data?.resource?.billing_agreement_id;
//             const subscription =
//                 await SubscriptionService.getActiveSubscriptionByPaypalId(
//                     paypal_subscription_id
//                 );

//             if (subscription?.paid_on) {
//                 const currentDate = dayjs(
//                     dayjs(new Date()).format("YYYY-MM-DD")
//                 );
//                 const lastPaidOn = dayjs(subscription?.paid_on).format(
//                     "YYYY-MM-DD"
//                 );
//                 const diffInDays = currentDate.diff(lastPaidOn, "day");

//                 // Using 28 to handle february
//                 if (diffInDays >= 28) {
//                     const planDetails = await SubscriptionService.getPlanById(
//                         subscription?.plan_id
//                     );

//                     await SubscriptionService.expirePreviousSubscriptions(
//                         subscription?.user_id
//                     );

//                     const plan_expiry_date = new Date();
//                     plan_expiry_date.setMonth(plan_expiry_date.getMonth() + 1);
//                     await SubscriptionService.createSubscription({
//                         user_id: subscription?.user_id,
//                         plan_id: planDetails?.id,
//                         active: true,
//                         status: SUBSCRIPTION_STATUS.ACTIVE as any,
//                         paypal_subscription_id: paypal_subscription_id,
//                         type: SUBSCRIPTION_TYPE.PREMIUM as any,
//                         total: planDetails?.amount,
//                         plan_name: planDetails?.name,
//                         time_limit: 1,
//                         time_type: "monthly",
//                         plan_amount: planDetails?.amount,
//                         plan_details: JSON.stringify(planDetails),
//                         expiry_date: plan_expiry_date,
//                         subscribed_at: new Date(),
//                         paid_on: new Date(),
//                         unsubscribed_at: null,
//                         signals_allowed: planDetails?.signal_allowed,
//                         signals_used: 0,
//                         algorithms_allowed: planDetails?.algorithm_allowed,
//                         algorithms_used: 0,
//                         charts_allowed: planDetails?.chart_allowed,
//                         charts_used: 0,
//                         active_charts_allowed:
//                             planDetails?.active_chart_allowed,
//                         active_charts_used: 0,
//                         is_additional_signals_allowed:
//                             planDetails?.is_additional_signals_allowed,
//                         additional_signals_allowed:
//                             planDetails?.additional_signal_allowed,
//                         additional_signals_used: 0,
//                         free_signals_allowed:
//                             planDetails?.signal_allowed_for_free_trial,
//                         free_signals_used: 0,
//                     });
//                 } else {
//                     console.log("Not a Recurring payment");
//                 }
//             }

//             return true;
//         } catch (err) {
//             console.error("Webhook Error: ", err);
//         }
//     }
// }
