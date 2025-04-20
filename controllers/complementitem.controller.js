import { ComplementItem } from '../models/complementitem.js';
import ErrorHandler from '../utils/errorHandler.js';
import mongoose from 'mongoose';

// Get all complementary items
export const getAllComplementItems = async (req, res, next) => {
  try {
    const items = await ComplementItem.find();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// Get a single complementary item by ID
export const getComplementItemById = async (req, res, next) => {
  try {
    const { itemID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemID)) {
      return next(new ErrorHandler("Invalid item ID", 400));
    }
    const item = await ComplementItem.findById(itemID);
    if (!item) {
      return next(new ErrorHandler('Complementary item not found', 404));
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// Create a new complementary item (Admin)
export const createComplementItem = async (req, res, next) => {
  try {
    const item = new ComplementItem(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, message: 'Complementary item created successfully' });
  } catch (error) {
    // Handle potential duplicate name errors if you add a unique index
    next(error);
  }
};

// Update a complementary item (Admin)
export const updateComplementItem = async (req, res, next) => {
  try {
    const { itemID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemID)) {
      return next(new ErrorHandler("Invalid item ID", 400));
    }
    const item = await ComplementItem.findByIdAndUpdate(itemID, req.body, { new: true, runValidators: true });
    if (!item) {
      return next(new ErrorHandler('Complementary item not found', 404));
    }
    res.status(200).json({ success: true, data: item, message: 'Complementary item updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete a complementary item (Admin)
export const deleteComplementItem = async (req, res, next) => {
  try {
    const { itemID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemID)) {
      return next(new ErrorHandler("Invalid item ID", 400));
    }
    const item = await ComplementItem.findByIdAndDelete(itemID);
    if (!item) {
      return next(new ErrorHandler('Complementary item not found', 404));
    }
    res.status(200).json({ success: true, message: 'Complementary item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
