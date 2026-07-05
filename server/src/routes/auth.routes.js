import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUserController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", authMiddleware, getCurrentUserController);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route working",
  });
});

export default router;
