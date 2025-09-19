import express from "express";
import cors from "cors";
import customersRouter from "./routes/customers.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import plansRouter from "./routes/plans.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import pinoHttp from "pino-http";
import crypto from "node:crypto";
import logger from "./lib/logger.js";

const app = express();

// CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

app.use(express.json());

// Request logging + request-id
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
    customProps: (req) => ({ requestId: req.id }),
  }),
);
// Request-Id'yi responsta geri döndür
app.use((req, res, next) => {
  if (req.id) res.setHeader("x-request-id", req.id);
  next();
});

// Root endpoint
app.get("/", (req, res) => res.json({ message: "Muhasebe API - Admin Panel MVP" }));

// Routes
app.use("/customers", customersRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/plans", plansRouter);

// Health
app.get("/db-check", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 404 & Error middlewares (en sonda)
app.use(notFound);
app.use(errorHandler);

export default app;
