import mongoose, { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  order: { 
    type: Schema.Types.ObjectId, 
    ref: "Order",
    required: true
  },
  showtime: { 
    type: Schema.Types.ObjectId, 
    ref: "Schedule",
    required: true 
  },
  seat: {
    type: Schema.Types.ObjectId, 
    ref: "Seat",
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["booked", "expired", "cancelled"], 
    default: "booked" 
  },
  ticketCode: String,
  checkinDate: {
    type: Date,
    required: false
  },
  notificationSent: { 
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

//tao ma + checkin date
ticketSchema.pre("save", async function(next) {
  if (!this.ticketCode) {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.ticketCode = `TIX-${randomCode}`;
  }
  if (!this.checkinDate && this.isNew) {
    const schedule = await mongoose.model("Schedule").findById(this.showtime);
    if (schedule) {
      this.checkinDate = schedule.startTime;
    }
  }
  next();
});

ticketSchema.statics.expireTickets = async function () {
  const now = new Date();
  await this.updateMany(
    { status: "booked", checkinDate: { $lt: now } }, 
    { $set: { status: "expired" } }
  );
};

export const Ticket = mongoose.model.Ticket || model("Ticket", ticketSchema);