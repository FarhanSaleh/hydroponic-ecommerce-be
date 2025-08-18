import { Router } from "express";
import { userController } from "./users/controller.js";
import { authMiddleware, storeMiddleware } from "../middleware/auth.js";
import { storeController } from "./stores/controller.js";
import { itemController } from "./items/controller.js";
import { upload } from "../middleware/file.js";
import { orderController } from "./orders/controller.js";

const router = Router();

// public routes
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);

router.get("/items", itemController.getItems);
router.get("/items/:id", itemController.getItemById);

// protect routes
router.use(authMiddleware);
router.get("/users", userController.getProfile);
router.get("/users/:id", userController.getUserById);
router.put("/users", userController.updateProfile);
router.put("/change-password", userController.changePassword);

router.get("/stores", storeController.getStores);
router.get("/my/stores", storeMiddleware, storeController.getMyStore);
router.get("/stores/:id", storeController.getStoreById);
router.get("/stores/:id/items", itemController.getItemsByStore);
router.post("/stores", storeController.createStore);
router.put("/stores/:id", storeController.updateMyStore);
router.delete("/stores/:id", storeController.deleteMyStore);

router.get("/orders", orderController.getOrders);
router.get("/orders/:id", orderController.getOrderById);
router.post("/orders", orderController.createOrder);
router.put("/orders/:id", orderController.updateOrder);
router.patch(
  "/orders/:id/pay",
  upload.single("image"),
  orderController.processPayment
);
router.patch("/orders/:id/status", orderController.updateOrderStatus);
router.patch(
  "/orders/:id/payment-status",
  orderController.updateOrderPaymentStatus
);

// protect routes for user with store
router.use(storeMiddleware);
router.get("/my/items", itemController.getMyItems);
router.post("/items", upload.single("image"), itemController.createItem);
router.put("/items/:id", upload.single("image"), itemController.updateItem);
router.delete("/items/:id", itemController.deleteItem);

export default router;
