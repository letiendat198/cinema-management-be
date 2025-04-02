import mongoose from "mongoose";
const complementItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Complement item name is required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    description: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true,
    },
});
export const ComplementItem = mongoose.model.ComplementItem || mongoose.model("ComplementItem", complementItemSchema);
