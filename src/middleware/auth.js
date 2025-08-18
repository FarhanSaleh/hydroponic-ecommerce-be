import { responseMessage } from "../constants/index.js";
import prisma from "../db/index.js";
import { verifyToken } from "../utils/index.js";

export function authMiddleware(req, res, next) {
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

export async function storeMiddleware(req, res, next) {
  console.log("Store middleware triggered");

  const store = await prisma.store.findUnique({
    where: { user_id: req.user.id },
  });

  if (!store) {
    return res.status(404).json({
      message: responseMessage.ERROR_UNAUTHORIZED,
    });
  }

  req.store = store;
  next();
}
