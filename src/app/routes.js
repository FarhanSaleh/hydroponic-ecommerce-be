import { Router } from "express";
import { userController } from "./users/controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { storeController } from "./stores/controller.js";

const router = Router();

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);

router.use(authMiddleware);
router.get("/profile", userController.getProfile);
router.get("/users/:id", userController.getUserById);
router.put("/profile", userController.updateProfile);
router.put("/change-password", userController.changePassword);

router.get("/stores", storeController.getStores);
router.post("/stores", storeController.createStore);
router.put("/stores/:id", storeController.updateMyStore);
router.get("/stores/:id", storeController.getStoreById);
router.delete("/stores/:id", storeController.deleteMyStore);

export default router;
