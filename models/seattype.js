import mongoose from "mongoose";
const seatTypeSchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, "Seat type label is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    value: {
        type: Number,
        required: [true, "A numeric seat type value is required"]
    },
    color: {
        type: String
    }
});
export const SeatType = mongoose.model.SeatType || mongoose.model("SeatType", seatTypeSchema);