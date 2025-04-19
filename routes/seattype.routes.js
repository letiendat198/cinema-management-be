import express from "express";
import {
  getAllSeatTypes,
  createSeatType,
  updateSeatType,
  deleteSeatType,
} from "../controllers/seattype.controller.js";

const router = express.Router();

router.get("/", getAllSeatTypes);
router.post("/", createSeatType);
router.put("/:seatTypeID", updateSeatType);
router.delete("/:seatTypeID", deleteSeatType);

export default router;
