import { SeatMap } from '../models/seatmap.js';
import { SeatType } from '../models/seattype.js';

export const getSeatMapByRoomID = async (req, res, next) => {
  try {
    const { roomID } = req.params;
    const seats = await SeatMap.find({roomID});
    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    next(error);
  }
};

export const createSeat = async (req, res, next) => {
  try {
    const seat = new SeatMap(req.body);
    const existedValue = await SeatMap.findOne({roomID: seat.roomID});
    if (existedValue) res.status(400).json({ success: false, message: 'Seat map for this roomID already existed' });
    await seat.save();
    res.status(201).json({ success: true, data: seat, message: 'New seat map created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateSeat = async (req, res, next) => {
  try {
    const { seatID } = req.params;
    const seat = await SeatMap.findByIdAndUpdate(seatID, req.body, { new: true, runValidators: true });
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    res.status(200).json({ success: true, data: seat, message: 'Seat map updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteSeat = async (req, res, next) => {
  try {
    const { seatID } = req.params;
    const seat = await SeatMap.findByIdAndDelete(seatID);
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    res.status(200).json({ success: true, message: 'Seat deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSeatDetailByIndex = async (req, res, next) => {
  try {
    const { roomID } = req.params;
    const { seatIndex } = req.body;
    const seats = await SeatMap.find({roomID});
    const seatLabel = seats.labelMap[seatIndex];
    const seatValue = seats.valueMap[seatIndex];
    const seatType = await SeatType.find({value: seatValue});
    res.status(200).json({ success: true, data: {roomID, seatIndex, seatLabel, seatType} });
  } catch (error) {
    next(error);
  }
};