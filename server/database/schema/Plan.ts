const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    active: { type: Boolean, default: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
}, {
    timestamps: true
});

export const Plan = mongoose.model('Plan', planSchema);
