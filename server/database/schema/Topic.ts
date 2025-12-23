const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    active: { type: Boolean, default: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    allowed_questions: { type: Number},
}, {
    timestamps: true
});

export const Topic = mongoose.model('Topic', topicSchema);
