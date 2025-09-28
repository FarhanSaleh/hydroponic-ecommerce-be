import config from "../../config/index.js";
import { responseMessage } from "../../constants/index.js";
import prisma from "../../db/index.js";
import { formatDate, removeFile } from "../../utils/index.js";

export const orderController = {
  getMyOrders: async (req, res) => {
    const orders = await prisma.order.findMany({
      where: {
        user_id: req.user.id,
      },
      include: {
        item: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    for (const order of orders) {
      if (order.payment_proof) {
        order.payment_proof = `${config.BASE_URL}${config.STATIC_PATH}/${order.payment_proof}`;
      }
      if (order.item) {
        order.item.image_url = `${config.BASE_URL}${config.STATIC_PATH}/${order.item.image_url}`;
      }
      order.created_at = formatDate(order.created_at);
      order.updated_at = formatDate(order.updated_at);
    }

    res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: orders,
    });
  },
  getOrders: async (req, res) => {
    const orders = await prisma.order.findMany({
      include: {
        item: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    for (const order of orders) {
      if (order.payment_proof) {
        order.payment_proof = `${config.BASE_URL}${config.STATIC_PATH}/${order.payment_proof}`;
      }
      if (order.item) {
        order.item.image_url = `${config.BASE_URL}${config.STATIC_PATH}/${order.item.image_url}`;
      }
      order.created_at = formatDate(order.created_at);
      order.updated_at = formatDate(order.updated_at);
    }

    res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: orders,
    });
  },
  getOrderById: async (req, res) => {
    const { id } = req.params;

    const orders = await prisma.order.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      include: {
        item: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
          },
        },
      },
    });

    if (!orders) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    if (orders.payment_proof) {
      orders.payment_proof = `${config.BASE_URL}${config.STATIC_PATH}/${orders.payment_proof}`;
    }
    if (orders.item) {
      orders.item.image_url = `${config.BASE_URL}${config.STATIC_PATH}/${orders.item.image_url}`;
    }
    orders.created_at = formatDate(orders.created_at);
    orders.updated_at = formatDate(orders.updated_at);

    res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: orders,
    });
  },
  createOrder: async (req, res) => {
    const { address, payment_method, item_id, amount } = req.body;

    if (!address || !payment_method || !item_id || !amount) {
      return res.status(400).json({
        message: responseMessage.ERROR_INVALID_INPUT,
      });
    }

    const item = await prisma.item.findUnique({
      where: { id: parseInt(item_id, 10) },
    });

    if (!item) {
      return res.status(404).json({
        message: "Sayur tidak ditemukan",
      });
    }

    if (item.stock < amount) {
      return res.status(400).json({
        message: "Stok tidak cukup",
      });
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          address,
          total_price: item.price * amount,
          payment_method,
          amount,
          price_at_order: item.price,
          user_id: req.user.id,
          item_id: item.id,
        },
      });
      await tx.item.update({
        data: {
          stock: {
            decrement: amount,
          },
        },
        where: {
          id: item_id,
        },
      });

      return order;
    });

    return res.status(201).json({
      message: responseMessage.SUCCESS_INSERT,
      data: newOrder,
    });
  },
  processPayment: async (req, res) => {
    const { id } = req.params;
    const fileName = req.file ? req.file.filename : null;
    if (!fileName) {
      return res.status(400).json({
        message: responseMessage.FIELD_REQUIRED,
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!order) {
      return res.status(404).json({ message: responseMessage.ERROR_NOT_FOUND });
    }

    const newOrder = await prisma.order.update({
      data: {
        payment_proof: fileName,
        payment_status: true,
      },
      where: {
        id: parseInt(id, 10),
      },
    });

    if (fileName && order.payment_proof) {
      removeFile(order.payment_proof);
    }

    return res.status(201).json({
      message: responseMessage.SUCCESS_UPDATE,
      data: newOrder,
    });
  },
  updateOrder: async (req, res) => {
    const { id } = req.params;
    const { address, payment_method } = req.body;

    if (!address || !payment_method) {
      return res.status(400).json({
        message: responseMessage.ERROR_INVALID_INPUT,
      });
    }

    const oldOrder = await prisma.order.findUnique({
      where: {
        user_id: req.user.id,
        id: parseInt(id, 10),
      },
    });

    if (!oldOrder) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    const newOrder = await prisma.order.update({
      data: {
        address,
        payment_method,
      },
      where: {
        id: parseInt(id, 10),
      },
    });

    return res.status(201).json({
      message: responseMessage.SUCCESS_INSERT,
      data: newOrder,
    });
  },
  updateOrderStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: responseMessage.ERROR_INVALID_INPUT,
      });
    }

    const oldOrder = await prisma.order.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!oldOrder) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    const newOrder = await prisma.order.update({
      data: {
        status,
      },
      where: {
        id: parseInt(id, 10),
      },
    });

    return res.status(201).json({
      message: responseMessage.SUCCESS_INSERT,
      data: newOrder,
    });
  },
  updateOrderPaymentStatus: async (req, res) => {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (payment_status === undefined) {
      return res.status(400).json({
        message: responseMessage.ERROR_INVALID_INPUT,
      });
    }

    const oldOrder = await prisma.order.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!oldOrder) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    const newOrder = await prisma.order.update({
      data: {
        payment_status,
      },
      where: {
        id: parseInt(id, 10),
      },
    });

    return res.status(201).json({
      message: responseMessage.SUCCESS_INSERT,
      data: newOrder,
    });
  },
  deleteOrder: async (req, res) => {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!order) {
      return res.status(404).json({ message: responseMessage.ERROR_NOT_FOUND });
    }

    await prisma.order.delete({
      where: { id: parseInt(id, 10) },
    });

    removeFile(order.payment_proof);

    return res.status(200).json({
      message: responseMessage.SUCCESS_DELETE,
    });
  },
};
