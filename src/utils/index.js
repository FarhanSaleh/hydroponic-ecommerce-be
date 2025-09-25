import { unlinkSync } from "fs";
import jsonwebtoken from "jsonwebtoken";
import { join } from "path";
import { isDate } from "util/types";

export function generateToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jsonwebtoken.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
}

export function verifyToken(token) {
  try {
    return jsonwebtoken.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw new Error(error.message || "Invalid token");
  }
}

export function removeFile(fileName) {
  try {
    const filePath = join(process.cwd(), "uploads", fileName);
    unlinkSync(filePath);
  } catch (error) {
    console.error("gagal delete file", error);
  }
}

export function formatDate(value) {
  if (isDate(value)) {
    return value.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const date = new Date(value);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
