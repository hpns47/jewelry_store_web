const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Токен отсутствует" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Невалидный токен" });
  }

  req.user = decoded;
  next();
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }
    next();
  };
};

module.exports = { authenticate, authorize };