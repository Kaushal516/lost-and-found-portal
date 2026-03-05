import mongoose from "mongoose";

const deletionRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true // One request per user
        },
        reason: {
            type: String,
            default: "User requested deletion"
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending"
        }
    },
    { timestamps: true }
);

const DeletionRequest = mongoose.model("DeletionRequest", deletionRequestSchema);
export default DeletionRequest;
