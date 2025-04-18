import express from "express";
import { getRooms, addRoom, updateRoom, deleteRoom } from "../controllers/room.controller.js";

const router = express.Router();

router.get("/:cinemaID", getRooms);
router.post("/", addRoom);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
