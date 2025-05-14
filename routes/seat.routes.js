import express from "express";
import { createSeatsForRoom, getSeatsByRoomID, updateSeats } from "../controllers/seat.controller.js";

const router = express.Router();

router.get("/:roomID", getSeatsByRoomID);
router.post("/:roomID", createSeatsForRoom);
router.put("/", updateSeats);

export default router;
