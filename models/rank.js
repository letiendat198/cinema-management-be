import mongoose from "mongoose";
const rankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Rank name is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    minPoints: {
        type: Number,
        required: [true, "Minimum points are required"]
    },
    discount: {
        type: Number,
        default: 0
    }
});
export const Rank = mongoose.model.Rank || mongoose.model("Rank", rankSchema);
