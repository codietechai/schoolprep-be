const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    active: { type: Boolean, default: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
}, {
    timestamps: true
});

export const Subject = mongoose.model('Subject', subjectSchema);