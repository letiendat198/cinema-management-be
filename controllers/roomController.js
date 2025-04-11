import { Room } from "../models/room.js";
//only get rooms by cinema
export const getRooms = async (req, res) => {
    try {
        const { cinemaID } = req.query;
        if(!cinemaID){
            return res.status(400).json({message:"cinemaID is required"});
        }
        const rooms = await Room.find({cinemaID}).populate("cinemaID");
        res.status(200).json(rooms);
    }
    catch (error){
        res.status(500).json({message: error.message});
    }
}

export const addRoom = async (req, res) => {
    try {
        const { cinemaID, roomNumber } = req.body;
        const newRoom = new Room({ cinemaID, roomNumber });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
        res.status(200).json(updatedRoom);
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
