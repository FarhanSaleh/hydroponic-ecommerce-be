import { responseMessage } from "../constants/index.js";

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  res.status(500).send({
    message: responseMessage.ERROR_SERVER,
    error: err.message,
  });
}
