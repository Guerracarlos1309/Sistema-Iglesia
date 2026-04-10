const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = decoded; 
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.error('🔴 JWT Error: Token expired at', error.expiredAt);
        return res.status(401).json({ message: 'Token de acceso expirado', code: 'TOKEN_EXPIRED' });
      }
      console.error('🔴 JWT Error:', error.message);
      return res.status(401).json({ message: 'Token de acceso inválido', code: 'INVALID_TOKEN' });
    }
  }

  if (!token) {
    console.warn('⚠️ Auth Warning: No bearer token provided in headers');
    return res.status(401).json({ message: 'No se proporcionó token de sesión', code: 'NO_TOKEN' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
