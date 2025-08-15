import prisma from "../../db/index.js";
import bcrypt from "bcrypt";
import { responseMessage } from "../../constants/index.js";
import { generateToken } from "../../utils/index.js";

export const userController = {
  register: async (req, res) => {
    const { name, email, password, phone_number } = req.body;

    if (!name || !email || !password || !phone_number) {
      return res.status(400).json({ message: responseMessage.FIELD_REQUIRED });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email tersebut sudah terdaftar." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone_number,
      },
    });

    return res.status(201).json({
      message: "Registrasi Berhasil.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
      },
    });
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: responseMessage.FIELD_REQUIRED });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "Password atau Email salah." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password atau Email salah" });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      message: "Login berhasil.",
      data: {
        token,
      },
    });
  },
  getProfile: async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: responseMessage.ERROR_NOT_FOUND });
    }

    return res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: user,
    });
  },
  getUserById: async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: responseMessage.ERROR_NOT_FOUND });
    }

    return res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: user,
    });
  },
  updateProfile: async (req, res) => {
    const { name, phone_number } = req.body;

    if (!name || !phone_number) {
      return res.status(400).json({ message: responseMessage.FIELD_REQUIRED });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone_number },
    });

    return res.status(200).json({
      message: responseMessage.SUCCESS_UPDATE,
      data: updatedUser,
    });
  },
  changePassword: async (req, res) => {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(400).json({ message: responseMessage.FIELD_REQUIRED });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: responseMessage.ERROR_NOT_FOUND });
    }

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password lama salah." });
    }

    const hashedNew_password = await bcrypt.hash(new_password, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNew_password },
    });

    return res.status(200).json({
      message: responseMessage.SUCCESS_UPDATE,
    });
  },
};
