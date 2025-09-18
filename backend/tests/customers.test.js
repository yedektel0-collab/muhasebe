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

  test("GET /customers (empty)", async () => {
    const res = await request(app).get("/customers");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("POST /customers creates customer", async () => {
    const res = await request(app)
      .post("/customers")
      .send({ name: "Alice", email: "alice@example.com" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test("POST then GET /customers returns inserted row", async () => {
    await request(app)
      .post("/customers")
      .send({ name: "Bob", email: "bob@example.com" });
    const res = await request(app).get("/customers");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].email).toBe("bob@example.com");
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

  test("POST duplicate email returns error", async () => {
    await request(app)
      .post("/customers")
      .send({ name: "U1", email: "dup@example.com" });
    const dup = await request(app)
      .post("/customers")
      .send({ name: "U2", email: "dup@example.com" });
    expect([400, 409]).toContain(dup.status);
  });
});
