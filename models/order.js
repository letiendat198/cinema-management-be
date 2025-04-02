import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ticketID: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
    },
}, { timestamps: true });

export const Order = mongoose.model.Order || mongoose.model("Order", orderSchema);
