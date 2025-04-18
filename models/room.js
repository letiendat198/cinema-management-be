import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    cinemaID: { // Để ý ID và Id
        type: mongoose.Schema.Types.ObjectId, 
        required: [true, "CinemaID is required"],
        ref: "Cinema" 
    },
    roomNumber: {
        type: Number,
        required: [true, "Room number is required"],
        trim: true
    },
    maxRow: {
        type: Number,
        required: [true, "Max row is required"]
    },
    maxColumn: {
        type: Number,
        required: [true, "Max column is required"]
    }
});

export const Room = mongoose.model.Room || mongoose.model("Room", roomSchema);
