import express from "express";
import customersRouter from "./routes/customers.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

import pinoHttp from "pino-http";
import crypto from "node:crypto";
import logger from "./lib/logger.js";

const app = express();
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

// Root -> /docs (opsiyonel)
app.get("/", (req, res) => res.redirect("/docs"));

// Swagger UI (notFound'dan önce olmalı)
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

// Routes
app.use("/customers", customersRouter);

// Health
app.get("/db-check", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 404 & Error middlewares (en sonda)
app.use(notFound);
app.use(errorHandler);

export default app;
