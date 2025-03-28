import e from "express";
import mongoose from "mongoose";
const seatSchema = new mongoose.Schema({
    roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    seatNumber: {
        type: String,
        required: [true, "Seat number is required"],
        trim: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    seatType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SeatType",
        required: [true, "Seat type is required"]
    },
    posX: {
        type: Number,
        required: [true, "X position is required"]
    },
    posY: {
        type: Number,
        required: [true, "Y position is required"]
    },
});
export const Seat = mongoose.model.Seat || mongoose.model("Seat", seatSchema);