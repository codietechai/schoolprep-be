const mongoose = require('mongoose');

// title, type, value, is_active, expiry_date, coupon_code

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount_percentage: { type: Number, required: true },
    type: { type: String, required: false },
    valid_from: { type: Date, required: true },
    valid_until: { type: Date, required: true },
    active: { type: Boolean, default: true }
}, {
    timestamps: true
});

export const Coupon = mongoose.model('Coupon', couponSchema);
