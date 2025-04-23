import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../index.js';

const router = express.Router();

// Get all admissions
router.get('/', async (req, res) => {
  try {
    const admissions = await prisma.admission.findMany({
      include: {
        patient: true,
        doctor: true,
        bed: true
      },
      orderBy: {
        admissionDate: 'desc'
      }
    });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get active admissions
router.get('/active', async (req, res) => {
  try {
    const admissions = await prisma.admission.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        patient: true,
        doctor: true,
        bed: true
      },
      orderBy: {
        admissionDate: 'desc'
      }
    });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get a single admission by ID
router.get('/:id', 
  param('id').isUUID().withMessage('Invalid admission ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const admission = await prisma.admission.findUnique({
        where: {
          id: req.params.id
        },
        include: {
          patient: true,
          doctor: true,
          bed: true
        }
      });
      
      if (!admission) {
        return res.status(404).json({ error: true, message: 'Admission not found' });
      }
      
      res.json(admission);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Create a new admission
router.post('/',
  [
    body('patientId').isUUID().withMessage('Valid patient ID is required'),
    body('bedId').isUUID().withMessage('Valid bed ID is required'),
    body('doctorId').isUUID().withMessage('Valid doctor ID is required'),
    body('admissionDate').isDate().withMessage('Valid admission date is required')
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
      
      // Check if bed exists and is available
      const bed = await prisma.bed.findUnique({
        where: {
          id: req.body.bedId
        }
      });
      
      if (!bed) {
        return res.status(400).json({ error: true, message: 'Bed not found' });
      }
      
      if (bed.status !== 'AVAILABLE') {
        return res.status(400).json({ error: true, message: 'Bed is not available' });
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
      
      // Check for active admissions for this patient
      const activeAdmission = await prisma.admission.findFirst({
        where: {
          patientId: req.body.patientId,
          status: 'ACTIVE'
        }
      });
      
      if (activeAdmission) {
        return res.status(400).json({ 
          error: true, 
          message: 'Patient already has an active admission' 
        });
      }
      
      // Start a transaction to create the admission and update the bed status
      const newAdmission = await prisma.$transaction(async (prisma) => {
        // Update bed status to occupied
        await prisma.bed.update({
          where: {
            id: req.body.bedId
          },
          data: {
            status: 'OCCUPIED',
            patientId: req.body.patientId,
            admissionDate: new Date(req.body.admissionDate),
            expectedDischargeDate: req.body.expectedDischargeDate ? new Date(req.body.expectedDischargeDate) : null
          }
        });
        
        // Create the admission
        return prisma.admission.create({
          data: {
            patient: {
              connect: {
                id: req.body.patientId
              }
            },
            bed: {
              connect: {
                id: req.body.bedId
              }
            },
            doctor: {
              connect: {
                id: req.body.doctorId
              }
            },
            admissionDate: new Date(req.body.admissionDate),
            diagnosis: req.body.diagnosis,
            notes: req.body.notes,
            status: 'ACTIVE'
          },
          include: {
            patient: true,
            doctor: true,
            bed: true
          }
        });
      });
      
      res.status(201).json(newAdmission);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Update an admission (e.g., discharge a patient)
router.put('/:id',
  [
    param('id').isUUID().withMessage('Invalid admission ID'),
    body('status').optional().isIn(['ACTIVE', 'DISCHARGED', 'TRANSFERRED']).withMessage('Valid status is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if admission exists
      const admission = await prisma.admission.findUnique({
        where: {
          id: req.params.id
        },
        include: {
          bed: true
        }
      });
      
      if (!admission) {
        return res.status(404).json({ error: true, message: 'Admission not found' });
      }
      
      // Handle status changes that affect the bed
      if (req.body.status && req.body.status !== 'ACTIVE' && admission.status === 'ACTIVE') {
        // Discharge or transfer: update both admission and free the bed
        const updatedAdmission = await prisma.$transaction(async (prisma) => {
          // Update admission
          const updated = await prisma.admission.update({
            where: {
              id: req.params.id
            },
            data: {
              status: req.body.status,
              dischargeDate: req.body.dischargeDate ? new Date(req.body.dischargeDate) : new Date(),
              notes: req.body.notes || admission.notes
            },
            include: {
              patient: true,
              doctor: true,
              bed: true
            }
          });
          
          // Free up the bed
          await prisma.bed.update({
            where: {
              id: admission.bedId
            },
            data: {
              status: 'AVAILABLE',
              patientId: null,
              admissionDate: null,
              expectedDischargeDate: null
            }
          });
          
          return updated;
        });
        
        return res.json(updatedAdmission);
      }
      
      // Simple update with no status change affecting bed
      const updatedAdmission = await prisma.admission.update({
        where: {
          id: req.params.id
        },
        data: {
          diagnosis: req.body.diagnosis || admission.diagnosis,
          notes: req.body.notes || admission.notes
        },
        include: {
          patient: true,
          doctor: true,
          bed: true
        }
      });
      
      res.json(updatedAdmission);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Delete an admission (admin only)
router.delete('/:id',
  param('id').isUUID().withMessage('Invalid admission ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if admission exists
      const admission = await prisma.admission.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!admission) {
        return res.status(404).json({ error: true, message: 'Admission not found' });
      }
      
      // Only allow deleting active admissions if also freeing the bed
      if (admission.status === 'ACTIVE') {
        // Free the bed as well
        await prisma.$transaction(async (prisma) => {
          await prisma.bed.update({
            where: {
              id: admission.bedId
            },
            data: {
              status: 'AVAILABLE',
              patientId: null,
              admissionDate: null,
              expectedDischargeDate: null
            }
          });
          
          await prisma.admission.delete({
            where: {
              id: req.params.id
            }
          });
        });
      } else {
        // For non-active admissions, simply delete
        await prisma.admission.delete({
          where: {
            id: req.params.id
          }
        });
      }
      
      res.json({ message: 'Admission deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

export default router;