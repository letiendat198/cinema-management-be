import mongoose from "mongoose";
const seatMapSchema = new mongoose.Schema({
    roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    valueMap: {
        type: [Number],
        required: [true, "Value map is required"]
    },
    labelMap: {
        type: [String],
        required: [true, "Label map is required"]
    }
});

export async function getRoomSeatLabelByIndex(roomID, seatIndex) {
        const seats = await SeatMap.findOne({roomID});
        const seatLabel = seats.labelMap[seatIndex];
        // const seatValue = seats.valueMap[seatIndex];
        // const seatType = await SeatType.find({value: seatValue});
        return seatLabel;
}

export const SeatMap = mongoose.model.SeatMap || mongoose.model("SeatMap", seatMapSchema);