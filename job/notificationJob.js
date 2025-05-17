import cron from "node-cron";
import { Ticket } from "../models/ticket.js";
import { User } from "../models/user.js"; 
import { Schedule } from "../models/schedule.js"; 
import { Movie } from "../models/movie.js";
import { Room } from "../models/room.js"; 
import { Cinema } from "../models/cinema.js";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";

const sendReminderNotifications = async () => {
  console.log("Running scheduled job: Send Reminder Notifications");
  try {
    const now = new Date();
    const targetTimeLowerBound = new Date(now.getTime() + 29 * 60 * 1000); 
    const targetTimeUpperBound = new Date(now.getTime() + 30 * 60 * 1000);

    const ticketsToNotify = await Ticket.find({
      status: "booked",
      notificationSent: false,
      checkinDate: { 
        $gte: targetTimeLowerBound,
        $lte: targetTimeUpperBound,
      },
    })
    .populate({
        path: 'user',
        select: 'username email' 
    })
    .populate({
        path: 'showtime',
        populate: [
            { 
                path: 'movieID', 
                select: 'title' 
            },
            { 
                path: 'roomID', 
                select: 'roomNumber cinemaID', 
                populate: { 
                    path: 'cinemaID', 
                    select: 'name' 
                } 
            }
        ]
    });

    if (ticketsToNotify.length === 0) {
      console.log("No tickets found for notification at this time.");
      return;
    }

    for (const ticket of ticketsToNotify) {
      if (!ticket.user || !ticket.user.email) {
        console.log(`Ticket ${ticket._id} has no user or user email?`);
        continue;
      }

      const movieTitle = ticket.showtime.movieID?.title || "Phim";
      const roomName = ticket.showtime.roomID?.roomNumber || "Không xác định";
      const cinemaName = ticket.showtime.roomID?.cinemaID?.name || "Rạp chiếu";
      const showtimeFormatted = new Date(ticket.checkinDate).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });

      const emailSubject = `Nhắc nhở: Phim "${movieTitle}" của bạn sắp chiếu!`;
      const emailMessage = `
        <p>Chào ${ticket.user.username || 'bạn'},</p>
        <p>Phim <strong>${movieTitle}</strong> của bạn sẽ bắt đầu vào lúc ${showtimeFormatted} tại phòng ${roomName}, ${cinemaName}.</p>
        <p>Vui lòng đến sớm để ổn định chỗ ngồi. Chúc bạn xem phim vui vẻ!</p>
        <p>Trân trọng,<br/>Đội ngũ Cinemax</p>
      `;

      const emailSent = await sendEmail({
        email: ticket.user.email,
        subject: emailSubject,
        message: emailMessage,
      });

      if (emailSent) {
        ticket.notificationSent = true;
        await ticket.save();
        console.log(`Notification sent for ticket ${ticket._id} to ${ticket.user.email}`);
      } else {
        console.error(`Failed to send notification for ticket ${ticket._id}`);
      }
    }
  } catch (error) {
    console.error("Error sending reminder notifications:", error);
  }
};

// Chạy job mỗi phút
export const scheduleReminderNotifications = () => {
    cron.schedule("* * * * *", sendReminderNotifications);
    console.log("Reminder notification job scheduled to run every minute.");
};
