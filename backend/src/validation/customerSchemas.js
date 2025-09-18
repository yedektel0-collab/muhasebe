import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});
