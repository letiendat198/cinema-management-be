import { Room } from "../models/room.js";
import ErrorHandler from "../utils/errorHandler.js";

//only get rooms by cinema
export const getRooms = async (req, res, next) => {
    try {
        const { cinemaID } = req.query;
        if(!cinemaID){
            return next(new ErrorHandler("cinemaID is required", 400));
        }
        const rooms = await Room.find({cinemaID}).populate("cinemaID");
        res.status(200).json(rooms);
    }
    catch (error){
        next(error);
    }
}

export const addRoom = async (req, res, next) => {
    try {
        const { cinemaID, roomNumber } = req.body;
        const newRoom = new Room({ cinemaID, roomNumber });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        next(error);
    }
};

export const updateRoom = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRoom) {
            return next(new ErrorHandler("Room not found", 404));
        }
        res.status(200).json(updatedRoom);
    } catch (error) {
        next(error);
    }
};

export const deleteRoom = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) {
            return next(new ErrorHandler("Room not found", 404));
        }
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        next(error);
    }
};
