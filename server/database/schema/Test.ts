import mongoose from "mongoose";
import { DATE } from "sequelize";

const TestSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },

        type: {
            type: String,
            enum: ["DIAGNOSTIC", "PREPARATORY"],
            required: true,
        },

        duration_of_exam: {
            type: Number,
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        topics: [
            {
                topic_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Topic",

                },
                allowed_question_number: {
                    type: Number,
                    required: false,  
                },
            },
        ],
        current_question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            require: true,
        },
        tutor: {
            type: Boolean,
            require: true,
        },
        question_mode: [{
            type: String,
            enum: ["CORRECT", "INCORRECT", "SKIPPED", "UNUSED", "NONE"],
            default: "NONE",
        }],
        total_questions: {
            type: Number,
        },
        course_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            require: true,
        },
        corrected_questions: {
            type: Number,
        },
        wrong_questions: {
            type: Number,
        },
        skipped_questions: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "SUBMITTED", "PAUSED"],
            default: "ACTIVE",
        },
        submitted_at: {
            type: Date,
        },
        progress: [
            {
                question: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                    require: true,
                },
                selected_option: { type: String || null },
                time_taken: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "TestActivity",
                    require: true,
                },
            },
        ],
        total_time:Number,
        paused_at: {
            type: Date,
            default: null,
        },
        unpaused_at: {
            type: Date,
            default: null,
        },
        bookmark_questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        test_percentage:{
            type: mongoose.Schema.Types.Decimal128, // Allows precise decimals
            default: 0.0
        },
    },
    { timestamps: true }
);

export const Test = mongoose.model("Test", TestSchema);
