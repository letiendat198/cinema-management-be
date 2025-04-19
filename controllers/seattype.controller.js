import { SeatType } from '../models/seattype.js';

export const getAllSeatTypes = async (req, res, next) => {
  try {
    const seatTypes = await SeatType.find();
    res.status(200).json({ success: true, data: seatTypes });
  } catch (error) {
    next(error);
  }
};

export const createSeatType = async (req, res, next) => {
  try {
    const seatType = new SeatType(req.body);
    const existedValue = await SeatType.findOne({value: seatType.value});
    if (existedValue) res.status(400).json({ success: false, message: 'Seat type value already used' });
    await seatType.save();
    res.status(201).json({ success: true, data: seatType });
  } catch (error) {
    next(error);
  }
};

export const updateSeatType = async (req, res, next) => {
  try {
    const { seatTypeID } = req.params;
    const seatType = await SeatType.findByIdAndUpdate(seatTypeID, req.body, { new: true, runValidators: true });
    if (!seatType) {
      return res.status(404).json({ success: false, message: 'SeatType not found' });
    }
    res.status(200).json({ success: true, data: seatType });
  } catch (error) {
    next(error);
  }
};

export const deleteSeatType = async (req, res, next) => {
  try {
    const { seatTypeID } = req.params;
    const seatType = await SeatType.findByIdAndDelete(seatTypeID);
    if (!seatType) {
      return res.status(404).json({ success: false, message: 'SeatType not found' });
    }
    res.status(200).json({ success: true, message: 'SeatType deleted successfully' });
  } catch (error) {
    next(error);
  }
};