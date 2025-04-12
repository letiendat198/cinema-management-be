import { User } from '../models/user.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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
    const existingUser = await User.findOne({ username }) || await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }
    const user = new User({
      username,
      email,
      password, 
      role: role || 'user'
    });
    
    await user.save();
    
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

// export const loginUser = async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
    
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid username or password' 
//       });
//     }
    
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid username or password' 
//       });
//     }
    
//     const token = jwt.sign(
//       { id: user._id, username: user.username, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );
    
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000 // 1 day
//     });
    
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getUserById = async (req, res, next) => {
  try {
    const { userID } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    const user = await User.findById(userID)
      .select('-password')
      .populate('userRank')
      .populate({
        path: 'watchHistory.movie',
        select: 'title genre year'
      });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    const user = await User.findByIdAndDelete(userID);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    const user = await User.findById(userID).populate('userRank');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (!user.userRank) {
      return res.status(404).json({ success: false, message: 'User has no rank yet' });
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
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    const user = await User.findById(userID);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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
