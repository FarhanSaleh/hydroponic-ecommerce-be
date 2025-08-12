import jsonwebtoken from "jsonwebtoken";

export function generateToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return jsonwebtoken.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
}

export function verifyToken(token) {
  try {
    return jsonwebtoken.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw new Error(error.Error);
  }
}
