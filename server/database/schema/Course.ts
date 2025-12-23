import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    image: String,
    active: { type: Boolean, default: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseCategory', required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    level: { type: String, default: 'BEGINNER', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] },
    selected_topic_for_exam:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    diagnostic_test_time:Number
}, {
    timestamps: true
});

export const Course = mongoose.model('Course', courseSchema);