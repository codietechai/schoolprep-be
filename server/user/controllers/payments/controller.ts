// import { NextFunction, Request, Response } from "express";
// import { get } from "lodash";
// import { sendResponse } from "admin/helpers";
// import { RESPONSE_TYPE, ERROR_MESSAGE, SUCCESS_MESSAGE } from "admin/constants";
// import Stripe from "stripe";
// import { CONFIG } from "config";
// import { UserSubscription } from "server/database/schema/user-subscriptions";
// import { User } from "server/database/schema";
// import mongoose from "mongoose";

// // const stripe = new Stripe(CONFIG.STRIPE_SECRET_KEY, {
// //     apiVersion: CONFIG.STRIPE_API_VERSION as any,
// // });

// export default class PaymentsController {
//     static async createCheckoutSession(
//         req: Request,
//         res: Response,
//         next: NextFunction
//     ) {
//         try {
//             const priceId = get(req?.body, "priceId", "");
//             const userId = get(req?.body, "userId", "");
//             const courseId = get(req?.body, "courseId", "");
//             const productId = get(req?.body, "productId", "");

//             const session = await stripe.checkout.sessions.create({
//                 payment_method_types: ["card"],
//                 line_items: [
//                     {
//                         price: priceId,
//                         quantity: 1,
//                     },
//                 ],
//                 mode: "payment",
//                 success_url: `${CONFIG.APP_BASE_URL}/portal/plans/sef`,
//                 cancel_url: `${CONFIG.APP_BASE_URL}/cancel`,
//                 metadata: {
//                     userId: userId,
//                     courseId: courseId,
//                     priceId: priceId,
//                     productId: productId,
//                 },
//             });

//             return res
//                 .status(201)
//                 .send(
//                     sendResponse(
//                         RESPONSE_TYPE.SUCCESS,
//                         SUCCESS_MESSAGE.STRIPE_SESSION_SUCCESS,
//                         { id: session.id }
//                     )
//                 );
//         } catch (err) {
//             console.log(">>>>>>>>> err", err);
//             return res.status(500).send({
//                 message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
//             });
//         }
//     }

//     static async listenStripeWebHook(
//         req: Request,
//         res: Response,
//         next: NextFunction
//     ) {
//         try {
//             const event = req.body;

//             switch (event.type) {
//                 case "checkout.session.completed":
//                     const session = event.data.object;
//                     const userPaymentSuccess = await UserSubscription.create({
//                         stripe_subscription_id: session.subscription,
//                         subscription_type:
//                             session.metadata?.subscription_type || "monthly",
//                         active: true,
//                         course: session.metadata.courseId,
//                         stripe_customer_id: session.customer,
//                         expires_at: session.expires_at,
//                         userId: session.metadata.userId,
//                         stripe_product_id: session.metadata.productId,
//                         stripe_price_id: session.metadata.priceId,
//                     });

//                     await User.findOneAndUpdate(
//                         {
//                             _id: new mongoose.Types.ObjectId(
//                                 session.metadata.userId
//                             ),
//                         },
//                         {
//                             $addToSet: { plan_id: userPaymentSuccess._id },
//                             is_user_subscribed: true,
//                         },
//                         { new: true, upsert: false }
//                     );

//                     break;

//                 case "invoice.payment_failed":
//                     const invoice = event.data.object;
//                     console.log("Payment failed:", invoice);
//                     break;

//                 default:
//                 // console.log(`Unhandled event type: ${event.type}`);
//             }

//             res.json({ received: true });
//         } catch (err) {
//             console.error("Stripe Webhook Error:", err);
//             return res.status(500).send({
//                 message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
//             });
//         }
//     }

//     static async fetchStripePlans(
//         req: Request,
//         res: Response,
//         next: NextFunction
//     ) {
//         try {
//             const products = await stripe.products.list({ active: true });

//             const filteredProducts = products.data.filter(
//                 (product) => product.metadata.course_name === "nclex-rn"
//             );

//             const prices = await stripe.prices.list({ active: true });

//             const plans = filteredProducts.map((product) => {
//                 return {
//                     productId: product.id,
//                     name: product.name,
//                     description: product.description,
//                     price: prices.data.find(
//                         (price) => price.product === product.id
//                     ),
//                     metadata: product.metadata,
//                 };
//             });

//             return res.send({
//                 message: "plans fetched successfully",
//                 data: plans,
//             });
//         } catch (error) {
//             console.error("Error fetching Stripe plans:", error);
//             throw error;
//         }
//     }

//     static async getSubscriptionDetails(
//         req: Request,
//         res: Response,
//         next: NextFunction
//     ) {
//         try {
//             const { priceId } = req.query;

//             // if (!subscriptionId) {
//             //     return res
//             //         .status(400)
//             //         .json({
//             //             success: false,
//             //             message: "Subscription ID is required",
//             //         });
//             // }

//             const price = await stripe.prices.retrieve(priceId as string);

//             res.json({ success: true, data: price });
//         } catch (error) {
//             console.error("Error fetching subscription:", error);
//             res.status(500).json({ success: false, error: error.message });
//         }
//     }
// }

// // failed
// // recurring
// // success
// // payment not done
