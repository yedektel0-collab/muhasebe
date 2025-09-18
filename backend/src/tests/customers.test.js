import request from "supertest";
import app from "../src/app.js";
import { ensureTestDatabase, resetTables } from "./testDb.js";

describe("Customers API", () => {
  beforeAll(async () => {
    await ensureTestDatabase();
  });

  beforeEach(async () => {
    await resetTables();
  });

  test("GET /customers (empty with meta)", async () => {
    const res = await request(app).get("/customers");
    expect(res.status).toBe(200);
    expect(res.body.meta).toBeDefined();
    expect(res.body.data).toEqual([]);
    expect(res.body.meta.total).toBe(0);
  });

  test("POST /customers creates customer", async () => {
    const res = await request(app)
      .post("/customers")
      .send({ name: "Alice", email: "alice@example.com" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test("POST then GET /customers returns inserted row & meta updated", async () => {
    await request(app)
      .post("/customers")
      .send({ name: "Bob", email: "bob@example.com" });
    const res = await request(app).get("/customers");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.meta.total).toBe(1);
    expect(res.body.data[0].email).toBe("bob@example.com");
  });

  test("GET /customers/:id returns item", async () => {
    const created = await request(app)
      .post("/customers")
      .send({ name: "Carl", email: "carl@example.com" });
    const id = created.body.id;
    const res = await request(app).get(`/customers/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("carl@example.com");
  });

  test("PUT /customers/:id updates item", async () => {
    const created = await request(app)
      .post("/customers")
      .send({ name: "Dora", email: "dora@example.com" });
    const id = created.body.id;
    const updated = await request(app)
      .put(`/customers/${id}`)
      .send({ name: "Dora Updated", email: "dora.updated@example.com" });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe("Dora Updated");
  });

  test("DELETE /customers/:id removes item", async () => {
    const created = await request(app)
      .post("/customers")
      .send({ name: "Ema", email: "ema@example.com" });
    const id = created.body.id;
    const del = await request(app).delete(`/customers/${id}`);
    expect(del.status).toBe(204);
    const fetch = await request(app).get(`/customers/${id}`);
    expect(fetch.status).toBe(404);
  });

  test("POST duplicate email returns 409", async () => {
    await request(app)
      .post("/customers")
      .send({ name: "U1", email: "dup@example.com" });
    const dup = await request(app)
      .post("/customers")
      .send({ name: "U2", email: "dup@example.com" });
    expect(dup.status).toBe(409);
    expect(dup.body.error.code).toBe("DUPLICATE_EMAIL");
  });

  test("POST invalid payload returns 400 validation error", async () => {
    const res = await request(app)
      .post("/customers")
      .send({ name: "A", email: "not-an-email" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });

  test("GET /customers pagination & search", async () => {
    // Seed a few
    await request(app)
      .post("/customers")
      .send({ name: "Alpha", email: "a1@example.com" });
    await request(app)
      .post("/customers")
      .send({ name: "Beta", email: "b1@example.com" });
    await request(app)
      .post("/customers")
      .send({ name: "Gamma", email: "g1@example.com" });

    const page1 = await request(app).get("/customers?limit=2&page=1");
    expect(page1.status).toBe(200);
    expect(page1.body.data.length).toBe(2);
    expect(page1.body.meta.total).toBe(3);

    const page2 = await request(app).get("/customers?limit=2&page=2");
    expect(page2.status).toBe(200);
    expect(page2.body.data.length).toBe(1);

    const search = await request(app).get("/customers?search=Beta");
    expect(search.status).toBe(200);
    expect(search.body.data.length).toBe(1);
    expect(search.body.data[0].name).toBe("Beta");
  });
});
