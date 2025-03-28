import mongoose from "mongoose";
const scheduleSchema = new mongoose.Schema({
    movieID: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
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