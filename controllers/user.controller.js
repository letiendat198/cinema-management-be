import { User } from '../models/user.js';
import sendToken from '../utils/jwtToken.js';
import mongoose from 'mongoose';
import ErrorHandler from "../utils/errorHandler.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }
    
    const existingUser = await User.findOne({ username }) || await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Username or email already exists", 400));
    }
    
    const user = new User({
      username,
      email,
      password, 
      role: role || 'user'
    });
    
    await user.save();
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return next(new ErrorHandler("Please provide username and password", 400));
    }
    
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }
    
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const { userID } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }
    
    const user = await User.findById(userID)
      .select('-password')
      .populate('userRank')
      .populate({
        path: 'watchHistory.movie',
        select: 'title genre year'
      });
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const { username, email, role, password } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }

    const user = await User.findById(userID);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    
    if (username) user.username = username;
    if (role) user.role = role;
    if (email) user.email = email;
    if (password) user.password = password;
    
    await user.save();
    
    const updatedUser = await User.findById(userID).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }
    
    const user = await User.findByIdAndDelete(userID);
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getUserRank = async (req, res, next) => {
  try {
    const { userID } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }
    
    const user = await User.findById(userID).populate('userRank');
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    
    if (!user.userRank) {
      return next(new ErrorHandler("User has no rank yet", 404));
    }
    
    res.status(200).json({ success: true, data: user.userRank });
  } catch (error) {
    next(error);
  }
};

export const getUserPoints = async (req, res, next) => {
  try {
    const { userID } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }
    
    const user = await User.findById(userID);
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    
    const points = user.watchHistory?.length || 0;
    
    res.status(200).json({ 
      success: true, 
      data: { 
        points,
        watchHistoryCount: user.watchHistory?.length || 0
      } 
    });
  } catch (error) {
    next(error);
  }
};
