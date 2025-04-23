import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../index.js';

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get appointments for today
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        patient: true,
        doctor: true
      },
      orderBy: [
        {
          status: 'asc'
        },
        {
          time: 'asc'
        }
      ]
    });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get a single appointment by ID
router.get('/:id', 
  param('id').isUUID().withMessage('Invalid appointment ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const appointment = await prisma.appointment.findUnique({
        where: {
          id: req.params.id
        },
        include: {
          patient: true,
          doctor: true
        }
      });
      
      if (!appointment) {
        return res.status(404).json({ error: true, message: 'Appointment not found' });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Create a new appointment
router.post('/',
  [
    body('patientId').isUUID().withMessage('Valid patient ID is required'),
    body('doctorId').isUUID().withMessage('Valid doctor ID is required'),
    body('date').isDate().withMessage('Valid date is required'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required (HH:MM)'),
    body('status').isIn(['SCHEDULED', 'IN_QUEUE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).withMessage('Valid status is required'),
    body('type').isIn(['GENERAL', 'FOLLOW_UP', 'SPECIALIST', 'EMERGENCY']).withMessage('Valid type is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if patient exists
      const patient = await prisma.patient.findUnique({
        where: {
          id: req.body.patientId
        }
      });
      
      if (!patient) {
        return res.status(400).json({ error: true, message: 'Patient not found' });
      }
      
      // Check if doctor exists
      const doctor = await prisma.user.findUnique({
        where: {
          id: req.body.doctorId
        }
      });
      
      if (!doctor || doctor.role !== 'DOCTOR') {
        return res.status(400).json({ error: true, message: 'Valid doctor not found' });
      }
      
      // Generate queue number
      let queueNumber = 1;
      
      if (req.body.status !== 'CANCELLED') {
        // Get the highest queue number for the day
        const highestQueue = await prisma.appointment.findFirst({
          where: {
            date: new Date(req.body.date),
            status: {
              not: 'CANCELLED'
            }
          },
          orderBy: {
            queueNumber: 'desc'
          }
        });
        
        if (highestQueue && highestQueue.queueNumber) {
          queueNumber = highestQueue.queueNumber + 1;
        }
      } else {
        queueNumber = null;
      }
      
      const newAppointment = await prisma.appointment.create({
        data: {
          patient: {
            connect: {
              id: req.body.patientId
            }
          },
          doctor: {
            connect: {
              id: req.body.doctorId
            }
          },
          date: new Date(req.body.date),
          time: req.body.time,
          status: req.body.status,
          type: req.body.type,
          notes: req.body.notes,
          queueNumber: queueNumber
        },
        include: {
          patient: true,
          doctor: true
        }
      });
      
      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Update an appointment
router.put('/:id',
  [
    param('id').isUUID().withMessage('Invalid appointment ID'),
    body('status').optional().isIn(['SCHEDULED', 'IN_QUEUE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).withMessage('Valid status is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if appointment exists
      const appointment = await prisma.appointment.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!appointment) {
        return res.status(404).json({ error: true, message: 'Appointment not found' });
      }
      
      // Update appointment
      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: req.params.id
        },
        data: {
          status: req.body.status,
          notes: req.body.notes
        },
        include: {
          patient: true,
          doctor: true
        }
      });
      
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Delete an appointment
router.delete('/:id',
  param('id').isUUID().withMessage('Invalid appointment ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if appointment exists
      const appointment = await prisma.appointment.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!appointment) {
        return res.status(404).json({ error: true, message: 'Appointment not found' });
      }
      
      // Delete appointment
      await prisma.appointment.delete({
        where: {
          id: req.params.id
        }
      });
      
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

export default router;