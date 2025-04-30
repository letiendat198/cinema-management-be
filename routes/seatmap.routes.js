import express from "express";
import {
  getSeatMapByRoomID,
  createSeat,
  updateSeat,
  deleteSeat,
  getSeatDetailByIndex,
} from "../controllers/seatmap.controller.js";

const router = express.Router();

router.get("/:roomID", getSeatMapByRoomID);
router.post("/", createSeat);
router.put("/:seatID", updateSeat);
router.delete("/:seatID", deleteSeat);
router.get("/detail/:roomID", getSeatDetailByIndex);

export default router;
