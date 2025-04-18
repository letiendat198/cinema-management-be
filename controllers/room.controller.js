import { Room } from "../models/room.js";
import { Cinema } from "../models/cinema.js"
import mongoose from "mongoose";
//only get rooms by cinema
export const getRooms = async (req, res) => {
    try {
        const { cinemaID } = req.params; // Để ý ID với Id
        if(!cinemaID){
            return res.status(400).json({message:"cinemaID is required"});
        }
        const rooms = await Room.find({cinemaID}).populate("cinemaID");
        res.status(200).json({success: true, data: rooms}); // Stick to 1 result format only!!!
    }
    catch (error){
        res.status(500).json({message: error.message});
    }
}

export const addRoom = async (req, res) => {
    try {
        const { cinemaID, roomNumber, maxRow, maxColumn } = req.body;
        const newRoom = new Room({ cinemaID, roomNumber, maxRow, maxColumn });
        await newRoom.save();
        res.status(201).json({data: newRoom, message: 'New room added successfully'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({data: updatedRoom, message: 'Room updated successfully'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
