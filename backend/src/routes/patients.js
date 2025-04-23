import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../index.js';

const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        lastName: 'asc'
      }
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get a single patient by ID
router.get('/:id', 
  param('id').isUUID().withMessage('Invalid patient ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const patient = await prisma.patient.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!patient) {
        return res.status(404).json({ error: true, message: 'Patient not found' });
      }
      
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Create a new patient
router.post('/',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('dateOfBirth').isDate().withMessage('Valid date of birth is required'),
    body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Valid gender is required'),
    body('contactNumber').notEmpty().withMessage('Contact number is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('mrn').notEmpty().withMessage('Medical Record Number (MRN) is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if MRN already exists
      const existingMRN = await prisma.patient.findUnique({
        where: {
          mrn: req.body.mrn
        }
      });
      
      if (existingMRN) {
        return res.status(400).json({ 
          error: true, 
          message: 'Medical Record Number (MRN) already in use' 
        });
      }
      
      const newPatient = await prisma.patient.create({
        data: {
          mrn: req.body.mrn,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateOfBirth: new Date(req.body.dateOfBirth),
          gender: req.body.gender,
          contactNumber: req.body.contactNumber,
          email: req.body.email,
          address: req.body.address,
          bloodGroup: req.body.bloodGroup,
          allergies: req.body.allergies,
          medicalHistory: req.body.medicalHistory
        }
      });
      
      res.status(201).json(newPatient);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Update a patient
router.put('/:id',
  [
    param('id').isUUID().withMessage('Invalid patient ID'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('dateOfBirth').isDate().withMessage('Valid date of birth is required'),
    body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Valid gender is required'),
    body('contactNumber').notEmpty().withMessage('Contact number is required'),
    body('address').notEmpty().withMessage('Address is required')
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
          id: req.params.id
        }
      });
      
      if (!patient) {
        return res.status(404).json({ error: true, message: 'Patient not found' });
      }
      
      // Update patient
      const updatedPatient = await prisma.patient.update({
        where: {
          id: req.params.id
        },
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateOfBirth: new Date(req.body.dateOfBirth),
          gender: req.body.gender,
          contactNumber: req.body.contactNumber,
          email: req.body.email,
          address: req.body.address,
          bloodGroup: req.body.bloodGroup,
          allergies: req.body.allergies,
          medicalHistory: req.body.medicalHistory
        }
      });
      
      res.json(updatedPatient);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Delete a patient
router.delete('/:id',
  param('id').isUUID().withMessage('Invalid patient ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if patient exists
      const patient = await prisma.patient.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!patient) {
        return res.status(404).json({ error: true, message: 'Patient not found' });
      }
      
      // Check if patient has active appointments or admissions
      const activeAppointments = await prisma.appointment.findMany({
        where: {
          patientId: req.params.id,
          status: {
            in: ['SCHEDULED', 'IN_QUEUE', 'IN_PROGRESS']
          }
        }
      });
      
      const activeAdmissions = await prisma.admission.findMany({
        where: {
          patientId: req.params.id,
          status: 'ACTIVE'
        }
      });
      
      if (activeAppointments.length > 0 || activeAdmissions.length > 0) {
        return res.status(400).json({ 
          error: true, 
          message: 'Cannot delete patient with active appointments or admissions' 
        });
      }
      
      // Delete patient
      await prisma.patient.delete({
        where: {
          id: req.params.id
        }
      });
      
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Get patient appointments
router.get('/:id/appointments',
  param('id').isUUID().withMessage('Invalid patient ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          patientId: req.params.id
        },
        include: {
          doctor: true
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Get patient admissions
router.get('/:id/admissions',
  param('id').isUUID().withMessage('Invalid patient ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const admissions = await prisma.admission.findMany({
        where: {
          patientId: req.params.id
        },
        include: {
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

export default router;