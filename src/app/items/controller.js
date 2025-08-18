import config from "../../config/index.js";
import { responseMessage } from "../../constants/index.js";
import prisma from "../../db/index.js";

export const itemController = {
  getItems: async (req, res) => {
    const items = await prisma.item.findMany();
    if (items.length === 0) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    for (const item of items) {
      item.image_url = `${config.BASE_URL}${config.STATIC_PATH}/${item.image_url}`;
    }

    return res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: items,
    });
  },
  getItemById: async (req, res) => {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!item) {
      return res.status(404).json({ message: responseMessage.ERROR_NOT_FOUND });
    }
    item.image_url = `${config.BASE_URL}${config.STATIC_PATH}/${item.image_url}`;

    return res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: item,
    });
  },
  getItemsByStore: async (req, res) => {
    const { id } = req.params;

    const items = await prisma.item.findMany({
      where: { store_id: parseInt(id, 10) },
    });

    if (items.length === 0) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    for (const item of items) {
      item.image_url = `${config.BASE_URL}${config.STATIC_PATH}/${item.image_url}`;
    }

    return res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: items,
    });
  },
  getMyItems: async (req, res) => {
    const id = req.store.id;

    const items = await prisma.item.findMany({
      where: { store_id: parseInt(id, 10) },
    });

    if (items.length === 0) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    for (const item of items) {
      item.image_url = `${config.BASE_URL}${config.STATIC_PATH}/${item.image_url}`;
    }

    return res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: items,
    });
  },
  createItem: async (req, res) => {
    const { name, description, price, stock } = req.body;
    const storeId = req.store.id;
    const fileName = req.file ? req.file.filename : null;

    if (!name || !price || !stock || !fileName) {
      return res.status(400).json({
        message: responseMessage.FIELD_REQUIRED,
      });
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        price: parseInt(price, 10),
        stock: parseInt(stock, 10),
        image_url: fileName,
        store_id: storeId,
      },
    });

    return res.status(201).json({
      message: responseMessage.SUCCESS_INSERT,
      data: newItem,
    });
  },
  updateItem: async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const storeId = req.store.id;
    const fileName = req.file ? req.file.filename : null;

    if (!name || !price || !stock || !fileName) {
      return res.status(400).json({
        message: responseMessage.FIELD_REQUIRED,
      });
    }

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id, 10), store_id: storeId },
    });

    if (!item) {
      return res.status(404).json({ message: responseMessage.ERROR_NOT_FOUND });
    }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        description,
        price: parseInt(price, 10),
        stock: parseInt(stock, 10),
        image_url: fileName || item.image_url,
        store_id: storeId,
      },
    });

    return res.status(200).json({
      message: responseMessage.SUCCESS_UPDATE,
      data: updatedItem,
    });
  },
  deleteItem: async (req, res) => {
    const { id } = req.params;
    const storeId = req.store.id;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id, 10), store_id: storeId },
    });

    if (!item) {
      return res.status(404).json({ message: responseMessage.ERROR_NOT_FOUND });
    }

    await prisma.item.delete({
      where: { id: parseInt(id, 10) },
    });

    return res.status(200).json({
      message: responseMessage.SUCCESS_DELETE,
    });
  },
};
