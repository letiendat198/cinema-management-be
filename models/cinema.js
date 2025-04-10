import mongoose,{Schema,model} from "mongoose";
const cinemaSchema = new Schema({
    name: {
        type: String,
        required: [true, "Cinema name is required"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    }
})
export const Cinema = mongoose.model.Cinema || mongoose.model("Cinema", cinemaSchema);