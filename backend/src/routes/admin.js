import express from 'express';
import { 
  getAdminUsers, 
  getAdminTickets, 
  updateTicketStatus,
  createPlan,
  updatePlan,
  deletePlan
} from '../controllers/adminController.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(isAdmin);

// Admin user management
router.get('/users', getAdminUsers);

// Admin ticket management  
router.get('/tickets', getAdminTickets);
router.patch('/tickets/:id', updateTicketStatus);

// Admin plan management
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

export default router;