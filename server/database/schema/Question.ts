const mongoose = require("mongoose");

const explanationSchema = new mongoose.Schema(
    {
        explanation_text: { type: String, default: null },
        explanation_image: { type: String, default: null },
        explanation_video: { type: String, default: null },
    },
    { _id: false }
);

const questionSchema = new mongoose.Schema(
    {
        question_text: { type: String, required: true },
        options: [
            {
                text: { type: String, required: true },
                isCorrect: { type: Boolean, required: true },
            },
        ],
        subject_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        topic_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic",
            required: false,
        },
        course_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        question_type: {
            type: String,
            default: "MCQ",
            enum: ["MCQ", "DESCRIPTIVE"],
        },
        difficulty_level: {
            type: String,
            default: "EASY",
            enum: ["EASY", "MEDIUM", "HARD"],
        },
        image_url: { type: String, default: null },
        explanation_text: { type: String, default: null },
        explanation_image: { type: String, default: null },
        explanation_video: { type: String, default: null },
        is_diagnostic: { type: Boolean, default: false },
        is_preparatory: { type: Boolean, default: false },
        is_real_exam: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
