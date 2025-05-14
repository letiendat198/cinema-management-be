import { Room } from '../models/room.js';
import { Seat } from '../models/seat.js';
import { SeatType } from '../models/seattype.js';

export const getSeatsByRoomID = async (req, res, next) => {
  try {
    const { roomID } = req.params;
    const seats = await Seat.find({roomID}).populate("seatType");
    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    next(error);
  }
};

export const createSeatsForRoom = async (req, res, next) => {
  try {
    const { roomID } = req.params;
    const existedValue = await Seat.findOne({roomID: roomID});
    if (existedValue) return res.status(200).json({ success: false, message: 'Seat map for this roomID already existed' });
    
    const room = await Room.findById(roomID);
    const defaultSeatType = await SeatType.findOne({label: "Standard"});
    const seatTypeID = defaultSeatType._id;

    const seatList = [];
    for(let i=0;i<room.maxRow;i++) {
        for (let j=0;j<room.maxColumn;j++) {
            let seat = {roomID: roomID, 
                                seatType: seatTypeID, 
                                seatNumber: i*room.maxColumn + j, 
                                row: i, 
                                column: j, 
                                label: String.fromCharCode(65+i) + j};
            seatList.push(seat);
        }
    }
    await Seat.insertMany(seatList);

    res.status(201).json({ success: true, message: 'New seat map created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateSeats = async (req, res, next) => {
  try {
    const updatedSeats = req.body;
    for (let seat of updatedSeats) {
        const status = await Seat.findByIdAndUpdate(seat._id, seat, { new: true, runValidators: true });    
        if (!status) {
            return res.status(404).json({ success: false, message: `Seat ${seat.seatNumber} not found` });
        }
    }
    res.status(200).json({ success: true, message: 'Seat updated successfully' });
  } catch (error) {
    next(error);
  }
};