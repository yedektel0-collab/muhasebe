import { Router } from "express";
import { healthRoot, dbCheck } from "../controllers/healthController.js";

const router = Router();

router.get("/", healthRoot);
router.get("/db-check", dbCheck);

export default router;
