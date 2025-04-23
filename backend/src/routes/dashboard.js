import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get dashboard summary data
router.get('/summary', async (req, res) => {
  try {
    // Get total patients
    const totalPatients = await prisma.patient.count();
    
    // Get total appointments
    const totalAppointments = await prisma.appointment.count();
    
    // Get appointments for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointmentsToday = await prisma.appointment.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    });
    
    // Get bed statistics
    const allBeds = await prisma.bed.count();
    const occupiedBeds = await prisma.bed.count({
      where: {
        status: 'OCCUPIED'
      }
    });
    const availableBeds = await prisma.bed.count({
      where: {
        status: 'AVAILABLE'
      }
    });
    
    // Get low stock items
    const lowStockItems = await prisma.inventoryItem.count({
      where: {
        quantity: {
          lte: prisma.inventoryItem.fields.reorderLevel
        }
      }
    });
    
    // Get recent admissions
    const recentAdmissions = await prisma.admission.findMany({
      take: 5,
      orderBy: {
        admissionDate: 'desc'
      },
      include: {
        patient: true,
        bed: true,
        doctor: true
      }
    });
    
    // Get upcoming appointments
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: today
        },
        status: {
          in: ['SCHEDULED', 'IN_QUEUE']
        }
      },
      take: 5,
      orderBy: [
        {
          date: 'asc'
        },
        {
          time: 'asc'
        }
      ],
      include: {
        patient: true,
        doctor: true
      }
    });
    
    res.json({
      totalPatients,
      totalAppointments,
      appointmentsToday,
      availableBeds,
      occupiedBeds,
      totalBeds: allBeds,
      occupancyRate: allBeds > 0 ? Math.round((occupiedBeds / allBeds) * 100) : 0,
      lowStockItems,
      recentAdmissions,
      upcomingAppointments
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get appointment statistics
router.get('/appointments/stats', async (req, res) => {
  try {
    // Get date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    // Get appointments grouped by day for the last 7 days
    const appointmentStats = await prisma.$queryRaw`
      SELECT 
        DATE(date) as day, 
        COUNT(*) as count 
      FROM "Appointment" 
      WHERE date >= ${sevenDaysAgo}
      GROUP BY DATE(date) 
      ORDER BY day ASC
    `;
    
    // Get appointments grouped by type
    const appointmentsByType = await prisma.appointment.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });
    
    // Get appointments grouped by status
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });
    
    res.json({
      daily: appointmentStats,
      byType: appointmentsByType,
      byStatus: appointmentsByStatus
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get bed occupancy statistics
router.get('/beds/stats', async (req, res) => {
  try {
    // Get beds grouped by ward and status
    const bedStats = await prisma.bed.groupBy({
      by: ['ward', 'status'],
      _count: {
        id: true
      }
    });
    
    // Transform data to be more usable on the frontend
    const wardStats = {};
    
    bedStats.forEach(stat => {
      if (!wardStats[stat.ward]) {
        wardStats[stat.ward] = {
          total: 0,
          available: 0,
          occupied: 0,
          maintenance: 0
        };
      }
      
      wardStats[stat.ward][stat.status.toLowerCase()] = stat._count.id;
      wardStats[stat.ward].total += stat._count.id;
    });
    
    res.json(wardStats);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

export default router;