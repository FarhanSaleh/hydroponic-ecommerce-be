import { responseMessage } from "../constants/index.js";
import { verifyToken } from "../utils/index.js";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: responseMessage.ERROR_UNAUTHORIZED });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      message: responseMessage.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}
