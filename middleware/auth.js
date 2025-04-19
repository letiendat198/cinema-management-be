import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";

export const authenticate = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return next(new ErrorHandler("Invalid token.", 400));
    }
};

export const authorize = (roles = []) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorHandler("Access denied. Insufficient permissions.", 403));
    }
    next();
};
