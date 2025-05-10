import cron from "node-cron";
import { Ticket } from "../models/ticket.js";
import { scheduleReminderNotifications } from "./notificationJob.js"; // Thêm import

// Refresh status ticket
cron.schedule("* * * * *", async () => {
  try {
    await Ticket.expireTickets();
    console.log("Expired tickets updated successfully.");
  } catch (error) {
    console.error("Error updating expired tickets:", error);
  }
});

scheduleReminderNotifications(); 
