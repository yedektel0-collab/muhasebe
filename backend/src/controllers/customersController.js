import {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../db/client.js";

export const listCustomers = async (req, res, next) => {
  try {
    const rows = await getAllCustomers();
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const addCustomer = async (req, res, next) => {
  try {
    const { name, email } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ error: "name ve email zorunludur" });
    }
    const created = await createCustomer({ name, email });
    res.status(201).json(created);
  } catch (e) {
    if (e.code === "23505") {
      return res.status(409).json({ error: "Bu email zaten kayıtlı" });
    }
    next(e);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Geçersiz id" });
    }
    const c = await getCustomerById(id);
    if (!c) return res.status(404).json({ error: "Müşteri bulunamadı" });
    res.json(c);
  } catch (e) {
    next(e);
  }
};

export const editCustomer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Geçersiz id" });
    }
    const { name, email } = req.body || {};
    if (!name && !email) {
      return res
        .status(400)
        .json({ error: "En az bir alan (name veya email) gönderilmeli" });
    }
    const updated = await updateCustomer(id, { name, email });
    if (!updated) return res.status(404).json({ error: "Müşteri bulunamadı" });
    res.json(updated);
  } catch (e) {
    if (e.code === "23505") {
      return res.status(409).json({ error: "Bu email zaten kayıtlı" });
    }
    next(e);
  }
};

export const removeCustomer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Geçersiz id" });
    }
    const ok = await deleteCustomer(id);
    if (!ok) return res.status(404).json({ error: "Müşteri bulunamadı" });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
