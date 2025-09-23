import { responseMessage } from "../constants/index.js";
import { verifyToken } from "../utils/index.js";

export function authMiddleware(req, res, next) {
  console.log("Auth middleware triggered", req.method, req.originalUrl);
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: responseMessage.ERROR_UNAUTHORIZED });
  }

  const decoded = verifyToken(token);
  req.user = decoded;
  next();
}

export function roleMiddleware(...roles) {
  return (req, res, next) => {
    console.log("Role middleware triggered");

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
}
