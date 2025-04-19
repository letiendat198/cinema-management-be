import express from "express";
import { getRooms, addRoom, updateRoom, deleteRoom, getRoomById } from "../controllers/room.controller.js";

const router = express.Router();

router.get("/cinemaID/:cinemaID", getRooms);
router.get("/roomID/:roomID", getRoomById)
router.post("/", addRoom);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
