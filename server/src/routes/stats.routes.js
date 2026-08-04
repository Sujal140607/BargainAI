import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCurrentUserStats } from "../controllers/stats.controller.js";

const statsRouter = Router();

statsRouter.get("/", authMiddleware, getCurrentUserStats);

export default statsRouter;
