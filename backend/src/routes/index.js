import { Router } from "express";
import { healthRoot, dbCheck } from "../controllers/healthController.js";
import {
  listCustomers,
  addCustomer,
  getCustomer,
  editCustomer,
  removeCustomer,
} from "../controllers/customersController.js";

const router = Router();

router.get("/", healthRoot);
router.get("/db-check", dbCheck);

// Customers CRUD
router.get("/customers", listCustomers);
router.post("/customers", addCustomer);
router.get("/customers/:id", getCustomer);
router.put("/customers/:id", editCustomer);
router.delete("/customers/:id", removeCustomer);

export default router;
