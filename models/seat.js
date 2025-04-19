import mongoose from "mongoose";
const seatSchema = new mongoose.Schema({
    roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    seatMap: {
        type: [Number],
        required: [true, "Seat map is required"]
    },
    labelMap: {
        type: [String],
        required: [true, "Label map is required"]
    }
});
export const Seat = mongoose.model.Seat || mongoose.model("Seat", seatSchema);