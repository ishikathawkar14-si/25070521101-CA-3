import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Reads the session token: HttpOnly cookie first, then the Authorization Bearer header
const getTokenFromRequest = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

export const protect = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, please log in' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_skillswap_jwt_key_2026_campus');

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Student account not found' });
    }
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, session expired or invalid' });
  }
};

// Like protect, but never blocks: a signed-in student gets req.user, a guest simply continues without it
export const optionalAuth = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_skillswap_jwt_key_2026_campus');
    req.user = await User.findById(decoded.id).select('-password');
  } catch (error) {
    // An expired or invalid token is treated the same as a guest
    req.user = null;
  }
  next();
};
