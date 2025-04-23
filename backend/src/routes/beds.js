import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../index.js';

const router = express.Router();

// Get all beds
router.get('/', async (req, res) => {
  try {
    const beds = await prisma.bed.findMany({
      include: {
        patient: true
      },
      orderBy: {
        bedNumber: 'asc'
      }
    });
    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get beds by ward
router.get('/ward/:ward', 
  param('ward').isIn(['GENERAL', 'ICU', 'EMERGENCY', 'PEDIATRIC', 'MATERNITY', 'PSYCHIATRIC']).withMessage('Invalid ward type'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const beds = await prisma.bed.findMany({
        where: {
          ward: req.params.ward
        },
        include: {
          patient: true
        },
        orderBy: {
          bedNumber: 'asc'
        }
      });
      
      res.json(beds);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Get available beds
router.get('/available', async (req, res) => {
  try {
    const beds = await prisma.bed.findMany({
      where: {
        status: 'AVAILABLE'
      },
      orderBy: {
        bedNumber: 'asc'
      }
    });
    
    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get a single bed by ID
router.get('/:id', 
  param('id').isUUID().withMessage('Invalid bed ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const bed = await prisma.bed.findUnique({
        where: {
          id: req.params.id
        },
        include: {
          patient: true
        }
      });
      
      if (!bed) {
        return res.status(404).json({ error: true, message: 'Bed not found' });
      }
      
      res.json(bed);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Create a new bed
router.post('/',
  [
    body('bedNumber').notEmpty().withMessage('Bed number is required'),
    body('ward').isIn(['GENERAL', 'ICU', 'EMERGENCY', 'PEDIATRIC', 'MATERNITY', 'PSYCHIATRIC']).withMessage('Valid ward type is required'),
    body('status').optional().isIn(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).withMessage('Valid status is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ error: true, message: 'Unauthenticated request' });
    }
    console.log('Authenticated user:', req.auth.userId)
    try {
      // Check if bed number already exists
      const existingBed = await prisma.bed.findUnique({
        where: {
          bedNumber: req.body.bedNumber
        }
      });
      
      if (existingBed) {
        return res.status(400).json({ 
          error: true, 
          message: 'Bed number already exists' 
        });
      }
      
      const newBed = await prisma.bed.create({
        data: {
          bedNumber: req.body.bedNumber,
          ward: req.body.ward,
          status: (req.body.status || 'AVAILABLE').toUpperCase(),
          notes: req.body.notes,
        }
      });
      
      res.status(201).json(newBed);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Update a bed
router.put('/:id',
  [
    param('id').isUUID().withMessage('Invalid bed ID'),
    body('status').optional().isIn(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).withMessage('Valid status is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if bed exists
      const bed = await prisma.bed.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!bed) {
        return res.status(404).json({ error: true, message: 'Bed not found' });
      }
      
      // Handle status changes
      if (req.body.status && req.body.status !== bed.status) {
        if (req.body.status === 'AVAILABLE' || req.body.status === 'MAINTENANCE') {
          // If changing to available or maintenance, remove any patient association
          return await prisma.bed.update({
            where: {
              id: req.params.id
            },
            data: {
              status: req.body.status,
              patientId: null,
              admissionDate: null,
              expectedDischargeDate: null,
              notes: req.body.notes
            }
          });
        } else if (req.body.status === 'OCCUPIED' && !req.body.patientId) {
          return res.status(400).json({
            error: true,
            message: 'Patient ID is required when setting bed status to occupied'
          });
        }
      }
      
      // Update patient association if provided
      if (req.body.patientId) {
        // Check if patient exists
        const patient = await prisma.patient.findUnique({
          where: {
            id: req.body.patientId
          }
        });
        
        if (!patient) {
          return res.status(400).json({ error: true, message: 'Patient not found' });
        }
        
        // Update bed with patient
        const updatedBed = await prisma.bed.update({
          where: {
            id: req.params.id
          },
          data: {
            status: 'OCCUPIED',
            patient: {
              connect: {
                id: req.body.patientId
              }
            },
            admissionDate: req.body.admissionDate ? new Date(req.body.admissionDate) : new Date(),
            expectedDischargeDate: req.body.expectedDischargeDate ? new Date(req.body.expectedDischargeDate) : null,
            notes: req.body.notes
          },
          include: {
            patient: true
          }
        });
        
        return res.json(updatedBed);
      }
      
      // Simple update with no patient change
      const updatedBed = await prisma.bed.update({
        where: {
          id: req.params.id
        },
        data: {
          notes: req.body.notes
        },
        include: {
          patient: true
        }
      });
      
      res.json(updatedBed);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Delete a bed
router.delete('/:id',
  param('id').isUUID().withMessage('Invalid bed ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if bed exists
      const bed = await prisma.bed.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!bed) {
        return res.status(404).json({ error: true, message: 'Bed not found' });
      }
      
      // Check if bed is currently occupied
      if (bed.status === 'OCCUPIED') {
        return res.status(400).json({ 
          error: true, 
          message: 'Cannot delete an occupied bed' 
        });
      }
      
      // Check if bed has active admissions
      const activeAdmissions = await prisma.admission.findMany({
        where: {
          bedId: req.params.id,
          status: 'ACTIVE'
        }
      });
      
      if (activeAdmissions.length > 0) {
        return res.status(400).json({ 
          error: true, 
          message: 'Cannot delete a bed with active admissions' 
        });
      }
      
      // Delete bed
      await prisma.bed.delete({
        where: {
          id: req.params.id
        }
      });
      
      res.json({ message: 'Bed deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

export default router;