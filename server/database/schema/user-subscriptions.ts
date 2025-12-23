const mongoose = require("mongoose");

const userSubscription = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subscription_type: { type: String, required: true },
        active: { type: Boolean, default: true },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        stripe_subscription_id: { type: String, require: true },
        expires_at: { type: Number, require: true },
        stripe_customer_id: { type: String, require: true },
        stripe_product_id: { type: String, require: true },
        stripe_price_id: { type: String, require: true },
    },
    {
        timestamps: true,
    }
);

export const UserSubscription = mongoose.model(
    "UserSubscription",
    userSubscription
);
