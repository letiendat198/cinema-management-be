import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tickets: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Ticket"
    }],
    complementItems: [{
        item: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "ComplementItem" 
        },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1, 
            default: 1 
        }
    }],
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    showtime: { // temporarily for pending order 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
    },
    _tempSeats: { 
        type: [Number], 
        required: true }
}, { timestamps: true });

export const Order = mongoose.model.Order || mongoose.model("Order", orderSchema);
