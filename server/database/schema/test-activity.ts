import mongoose from "mongoose";

const TestActivitySchema = new mongoose.Schema(
    {
        current_question_id: {
            type: mongoose.Types.ObjectId,
            ref: "Question",
        },
        new_question_id:{
            type: mongoose.Types.ObjectId,
            ref: "Question",
        },
        test_id: {
            type: mongoose.Types.ObjectId,
            ref: "Test",
        },
        action: {
            type:String,
            enum: ["TEST_STARTED","BACK", "NEXT", "PAUSED"],
        },
        previous_time_in_seconds:{
            type:Number,
        },
        started_at: {
            type: Date,
        },
        ended_at: {
            type: Date,
            default:null
        },
        revisted_at: {
            type: Date,
            default:null
        },
    },
);
export const TestActivity = mongoose.model("TestActivity", TestActivitySchema);
