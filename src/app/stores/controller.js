import { responseMessage } from "../../constants/index.js";
import prisma from "../../db/index.js";

export const storeController = {
  getStores: async (req, res) => {
    try {
      const stores = await prisma.store.findMany();
      if (stores.length === 0) {
        return res.status(404).json({
          message: responseMessage.ERROR_NOT_FOUND,
        });
      }

      return res.status(200).json({
        message: responseMessage.SUCCESS_FETCH,
        data: stores,
      });
    } catch (error) {
      return res.status(500).json({
        message: responseMessage.ERROR_SERVER,
        error: error.message,
      });
    }
  },
  getStoreById: async (req, res) => {
    const { id } = req.params;
    try {
      const store = await prisma.store.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!store) {
        return res
          .status(404)
          .json({ message: responseMessage.ERROR_NOT_FOUND });
      }

      return res.status(200).json({
        message: responseMessage.SUCCESS_FETCH,
        data: store,
      });
    } catch (error) {
      return res.status(500).json({
        message: responseMessage.ERROR_SERVER,
        error: error.message,
      });
    }
  },
  getMyStore: async (req, res) => {
    return res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: req.store,
    });
  },
  createStore: async (req, res) => {
    const {
      name,
      address,
      description,
      phone_number,
      bank_name,
      bank_account_name,
      bank_account_number,
    } = req.body;

    if (
      !name ||
      !address ||
      !description ||
      !phone_number ||
      !bank_name ||
      !bank_account_name ||
      !bank_account_number
    ) {
      return res.status(400).json({
        message: responseMessage.FIELD_REQUIRED,
      });
    }

    try {
      const newStore = await prisma.store.create({
        data: {
          name,
          address,
          description,
          phone_number,
          bank_name,
          bank_account_name,
          bank_account_number,
          user_id: req.user.id,
        },
      });

      return res.status(201).json({
        message: responseMessage.SUCCESS_INSERT,
        data: newStore,
      });
    } catch (error) {
      return res.status(500).json({
        message: responseMessage.ERROR_SERVER,
        error: error.message,
      });
    }
  },
  updateMyStore: async (req, res) => {
    const { id } = req.params;
    const {
      name,
      address,
      description,
      phone_number,
      bank_name,
      bank_account_name,
      bank_account_number,
    } = req.body;

    if (
      !name ||
      !address ||
      !description ||
      !phone_number ||
      !bank_name ||
      !bank_account_name ||
      !bank_account_number
    ) {
      return res.status(400).json({
        message: responseMessage.FIELD_REQUIRED,
      });
    }

    try {
      const updatedStore = await prisma.store.update({
        where: { user_id: req.user.id, id: parseInt(id) },
        data: {
          name,
          address,
          description,
          phone_number,
          bank_name,
          bank_account_name,
          bank_account_number,
        },
      });

      return res.status(200).json({
        message: responseMessage.SUCCESS_UPDATE,
        data: updatedStore,
      });
    } catch (error) {
      return res.status(500).json({
        message: responseMessage.ERROR_SERVER,
        error: error.message,
      });
    }
  },
  deleteMyStore: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedStore = await prisma.store.delete({
        where: { user_id: req.user.id, id: parseInt(id) },
      });

      return res.status(200).json({
        message: responseMessage.SUCCESS_DELETE,
        data: deletedStore,
      });
    } catch (error) {
      return res.status(500).json({
        message: responseMessage.ERROR_SERVER,
        error: error.message,
      });
    }
  },
};
