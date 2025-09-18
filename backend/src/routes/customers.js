import express from "express";
import pool from "../db/pool.js";
import { validate } from "../middleware/validate.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../validation/customerSchemas.js";

const router = express.Router();

/**
 * Query param pagination & search:
 * page (default 1), limit (default 20, max 100), search (LIKE %term%)
 */
router.get("/", async (req, res, next) => {
  try {
    let { page = "1", limit = "20", search = "" } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(limit) || limit < 1) limit = 20;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;
    let params = [];
    let where = "";
    if (search) {
      params.push(`%${search}%`);
      where = `WHERE name ILIKE $${params.length} OR email ILIKE $${params.length}`;
    }

    const baseQuery = `SELECT id, name, email, created_at FROM customers ${where} ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const rowsPromise = pool.query(baseQuery, params);

    // Count (ayrı sorgu)
    let countQuery = "SELECT COUNT(*) AS count FROM customers";
    let countParams = [];
    if (search) {
      countQuery += " WHERE name ILIKE $1 OR email ILIKE $1";
      countParams = [`%${search}%`];
    }
    const countPromise = pool.query(countQuery, countParams);

    const [rowsResult, countResult] = await Promise.all([
      rowsPromise,
      countPromise,
    ]);
    const total = parseInt(countResult.rows[0].count, 10);

    res.json({
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      data: rowsResult.rows,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const r = await pool.query(
      "SELECT id, name, email, created_at FROM customers WHERE id=$1",
      [req.params.id],
    );
    if (r.rowCount === 0) {
      const err = new Error("Customer not found");
      err.status = 404;
      err.code = "CUSTOMER_NOT_FOUND";
      throw err;
    }
    res.json(r.rows[0]);
  } catch (e) {
    next(e);
  }
});

router.post("/", validate(createCustomerSchema), async (req, res, next) => {
  const { name, email } = req.validated;
  try {
    const r = await pool.query(
      "INSERT INTO customers(name, email) VALUES ($1,$2) RETURNING id, name, email, created_at",
      [name, email],
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    if (e.code === "23505") {
      e.status = 409;
      e.code = "DUPLICATE_EMAIL";
      e.message = "Email already exists";
    }
    next(e);
  }
});

router.put("/:id", validate(updateCustomerSchema), async (req, res, next) => {
  const { name, email } = req.validated;
  try {
    const r = await pool.query(
      "UPDATE customers SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, created_at",
      [name, email, req.params.id],
    );
    if (r.rowCount === 0) {
      const err = new Error("Customer not found");
      err.status = 404;
      err.code = "CUSTOMER_NOT_FOUND";
      throw err;
    }
    res.json(r.rows[0]);
  } catch (e) {
    if (e.code === "23505") {
      e.status = 409;
      e.code = "DUPLICATE_EMAIL";
      e.message = "Email already exists";
    }
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const r = await pool.query("DELETE FROM customers WHERE id=$1", [
      req.params.id,
    ]);
    if (r.rowCount === 0) {
      const err = new Error("Customer not found");
      err.status = 404;
      err.code = "CUSTOMER_NOT_FOUND";
      throw err;
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
