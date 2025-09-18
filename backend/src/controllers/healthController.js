import { getDbTime } from "../db/client.js";

export const healthRoot = (req, res) => {
  res.send("Muhasebe API çalýþýyor");
};

export const dbCheck = async (req, res) => {
  try {
    const time = await getDbTime();
    res.json({ status: "ok", time });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
