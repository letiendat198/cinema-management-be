import express from "express";
import {
  getSeatMapByRoomID,
  createSeat,
  updateSeat,
  deleteSeat,
} from "../controllers/seat.controller.js";

const router = express.Router();

router.get("/:roomID", getSeatMapByRoomID);
router.post("/", createSeat);
router.put("/:seatID", updateSeat);
router.delete("/:seatID", deleteSeat);

export default router;
