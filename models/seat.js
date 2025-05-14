import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    roomID: { // Để ý ID và Id
        type: mongoose.Schema.Types.ObjectId, 
        required: [true, "RoomID is required"],
        ref: "Room" 
    },
    seatType: {
        type: mongoose.Schema.Types.ObjectId, 
        required: [true, "SeatType is required"],
        ref: "SeatType" 
    },
    seatNumber: {
        type: Number,
        required: [true, "Seat number is required"],
        trim: true
    },
    row: {
        type: Number,
        required: [true, "Max row is required"]
    },
    column: {
        type: Number,
        required: [true, "Max column is required"]
    },
    label: {
        type: String,
        required: [true, "Label is required"]
    }
});

export const Seat = mongoose.model.Seat || mongoose.model("Seat", seatSchema);