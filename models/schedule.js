import mongoose from "mongoose";
const scheduleSchema = new mongoose.Schema({
    movieID: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: [true, "movieID is required"] },
    roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: [true, "roomID is required"] },
    startTime: {
        type: Date,
        required: [true, "Start time is required"],
    },
    endTime: {
        type: Date,
        required: [true, "End time is required"],
    },
});
export const Schedule = mongoose.model.Schedule || mongoose.model("Schedule", scheduleSchema);