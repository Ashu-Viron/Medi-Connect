import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

export default router;
