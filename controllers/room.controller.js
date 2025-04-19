import { Room } from "../models/room.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Cinema } from "../models/cinema.js"
import mongoose from "mongoose";
//only get rooms by cinema
export const getRooms = async (req, res, next) => {
    try {
        const { cinemaID } = req.params; // Để ý ID với Id
        if(!cinemaID){
            return next(new ErrorHandler("cinemaID is required", 400));
        }
        const rooms = await Room.find({cinemaID}).populate("cinemaID");
        res.status(200).json({success: true, data: rooms}); // Stick to 1 result format only!!!
    }
    catch (error){
        next(error);
    }
}

export const getRoomById = async (req, res, next) => {
    try {
        const { roomID } = req.params; // Để ý ID với Id
        if(!roomID){
            return next(new ErrorHandler("roomID is required", 400));
        }
        const rooms = await Room.findById(roomID).populate("cinemaID");
        res.status(200).json({success: true, data: rooms}); // Stick to 1 result format only!!!
    }
    catch (error){
        next(error);
    }
}

export const addRoom = async (req, res, next) => {
    try {
        const { cinemaID, roomNumber, maxRow, maxColumn } = req.body;
        const newRoom = new Room({ cinemaID, roomNumber, maxRow, maxColumn });
        await newRoom.save();
        res.status(201).json({data: newRoom, message: 'New room added successfully'});
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
        res.status(200).json({data: updatedRoom, message: 'Room updated successfully'});
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
