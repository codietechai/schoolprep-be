const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        password: String,
        email: String,
        role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
        full_name: String,
        contact_number: String,
        country_code: String,
        phone_code: String,
        status: {
            type: String,
            default: "ACTIVE",
            enum: ["ACTIVE", "INACTIVE"],
        },
        registration_date: Date,
        profile_photo: String,
        address: String,
        last_login_at: String,
        last_login_ip: String,
        refresh_token: String,
        email_code: String,
        email_code_expiry: Date,
        is_user_subscribed: { type: Boolean, default: false },
        plan_id: [
            { type: mongoose.Schema.Types.ObjectId, ref: "UserSubscription" },
        ],
        email_verified: Boolean,
        phone_otp_code: String,
        phone_code_expiry: String,
        phone_verified: Boolean,
        password_reset_code: String,
        password_reset_expiry: String,
        timezone: String,
        corrected_questions: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        ],
        wrong_questions: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        ],
        skipped_questions: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        ],
        token_status: String,
        is_agreed: Boolean,
        ongoing_test_id: String,
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);
