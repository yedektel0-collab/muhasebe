import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", router);

// 404
app.use((req, res, next) => {
  return res.status(404).json({ error: "Not Found" });
});

// Global error
app.use((err, req, res, next) => {
  console.error("Hata:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;