import { Router } from "express";
import { userController } from "./users/controller.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import { itemController } from "./items/controller.js";
import { upload } from "../middleware/file.js";
import { orderController } from "./orders/controller.js";
import { settingController } from "./settings/controller.js";

const router = Router();

// public routes
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);

router.get("/items", itemController.getItems);
router.get("/items/:id", itemController.getItemById);
router.get("/settings/bank", settingController.getBankDetail);

// protect routes
router.use(authMiddleware);
router.get("/users", userController.getProfile);
router.get("/users/:id", userController.getUserById);
router.put("/users", userController.updateProfile);
router.put("/change-password", userController.changePassword);

router.get("/orders", orderController.getOrders);
router.get("/orders/my", orderController.getMyOrders);
router.get("/orders/:id", orderController.getOrderById);
router.post("/orders", orderController.createOrder);
router.put("/orders/:id", orderController.updateOrder);
router.patch(
  "/orders/:id/pay",
  upload.single("image"),
  orderController.processPayment
);
router.delete("/orders/:id", orderController.deleteOrder);
router.patch("/orders/:id/status", orderController.updateOrderStatus);

// protect routes for user with store
router.use(roleMiddleware("ADMIN"));
router.patch(
  "/orders/:id/payment-status",
  orderController.updateOrderPaymentStatus
);
router.post("/items", upload.single("image"), itemController.createItem);
router.put("/items/:id", upload.single("image"), itemController.updateItem);
router.delete("/items/:id", itemController.deleteItem);
router.patch("/settings/bank", settingController.updateBankDetail);

export default router;
