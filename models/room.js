import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    cinemaID: { type: mongoose.Schema.Types.ObjectId, ref: "Cinema" },
    roomNumber: {
        type: Number,
        required: [true, "Room number is required"],
        trim: true
    },
});

export const Room = mongoose.model.Room || mongoose.model("Room", roomSchema);
