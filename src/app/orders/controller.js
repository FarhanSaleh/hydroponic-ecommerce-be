import config from "../../config/index.js";
import { responseMessage } from "../../constants/index.js";
import prisma from "../../db/index.js";

export const orderController = {
  getOrders: async (req, res) => {
    const orders = await prisma.order.findMany({
      where: {
        user_id: req.user.id,
      },
      include: {
        OrderDetails: {
          include: {
            item: true,
          },
        },
      },
    });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

    for (const order of orders) {
      order.payment_proof = `${config.BASE_URL}${config.STATIC_PATH}/${order.payment_proof}`;
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
        user_id: req.user.id,
        id: parseInt(id, 10),
      },
      include: {
        OrderDetails: {
          include: {
            item: true,
          },
        },
      },
    });

    orders.payment_proof = `${config.BASE_URL}${config.STATIC_PATH}/${orders.payment_proof}`;

    if (!orders) {
      return res.status(404).json({
        message: responseMessage.ERROR_NOT_FOUND,
      });
    }

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
          store_id: item.store_id,
          user_id: req.user.id,
        },
      });
      const detailOrder = await tx.orderDetail.create({
        data: {
          amount,
          price_at_order: item.price,
          item_id: item.id,
          order_id: order.id,
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

      return detailOrder;
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

    const newOrder = await prisma.order.update({
      data: {
        payment_proof: fileName,
      },
      where: {
        id: parseInt(id, 10),
      },
    });

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

    if (!payment_status) {
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
};
