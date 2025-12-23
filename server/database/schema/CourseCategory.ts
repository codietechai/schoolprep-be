import mongoose from "mongoose";

const courseCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true }, // Trim to remove leading/trailing spaces
        description: { type: String, default: null }, // Default value if no description is provided
        active: { type: Boolean, default: true }, // Default status as active
        image: { type: String, default: null },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

export const CourseCategory = mongoose.model("CourseCategory", courseCategorySchema);