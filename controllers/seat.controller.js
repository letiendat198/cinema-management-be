import { Seat } from '../models/seat.js';

export const getSeatMapByRoomID = async (req, res, next) => {
  try {
    const { roomID } = req.params;
    const seats = await Seat.find({roomID});
    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    next(error);
  }
};

export const createSeat = async (req, res, next) => {
  try {
    const seat = new Seat(req.body);
    const existedValue = await Seat.findOne({roomID: seat.roomID});
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
    const seat = await Seat.findByIdAndUpdate(seatID, req.body, { new: true, runValidators: true });
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
    const seat = await Seat.findByIdAndDelete(seatID);
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    res.status(200).json({ success: true, message: 'Seat deleted successfully' });
  } catch (error) {
    next(error);
  }
};