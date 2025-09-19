import express from 'express';
import { getAllPlans } from '../controllers/plansController.js';

const router = express.Router();

router.get('/', getAllPlans);

export default router;